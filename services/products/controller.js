const path = require('path').resolve;
const config = require(path('config/constants'));
const apiError = require('./../../common/api-errors');

const messages = require('./../../common/messages');
const ResponseService = require('./../../common/response');
// const UserService = require('../services/user');

const ProductService = require('./service')


class AuthController {
    login = async (req, res) => {
        try {
            let request = Object.assign({}, req.body);
            console.log("Hey hey ");
            // If no username provided, Throw error.
            if (!request.email) throw new apiError.ValidationError('username', messages.EMAIL_REQUIRED);
            request.email = request.email.toLowerCase();

            // If no password provided, Throw unauthorized
            if (!request.password) throw new apiError.ValidationError('password', messages.PASSWORD_REQUIRED);

            //Get User 
            // 
            let User = await UserService.getUser({ email: request.email })

            if (!User) throw new apiError.NotFoundError('User', messages.USERNAME_OR_PASSWORD_INVALID);

            if (User.status != 1) throw new apiError.NotFoundError('User', messages.USER_INACTIVE)

            // let matchBcrypt = await bcrypt.compare(request.password, User.password);
            // if (!matchBcrypt) throw new apiError.UnauthorizedError(messages.USERNAME_OR_PASSWORD_INVALID);

            //Remove Password 
            // console.log(User, 'This found !!', this);

            User.password = null;

            //Generate JWT Token 
            let token = await this.getJwtAuthToken(User)
            // let token =""
            let response = {
                token, User
            }
            return res.status(200).send(ResponseService.success(response));
        }
        catch (err) {
            return res.status(err.code || 500).send(ResponseService.failure(err));
        }

    }
    async register(req, res) {
        try {
            let details = Object.assign({}, req.body)
            //  , , password, , , , : aadhar-panCard, company: name-code ,,designation
            if (!details.email) throw new apiError.ValidationError('Email', messages.EMAIL_REQUIRED)
            let userCheck = await UserService.getUser({ email: details.email })
            if (userCheck) throw new apiError.ResourceAlreadyExistError('Email', messages.EMAIL_ALREADY_EXIST);

            if (!details.name) throw new apiError.ValidationError('Full Name', messages.NAME_REQUIRED);
            if (!details.contactNumber) throw new apiError.ValidationError('Contact Number', messages.CONTACT_REQUIRED);
            // if (!details.reportingTL) throw new apiError.ValidationError('Reporting TL',messages.TL_REQUIRED);
            if (!details.password) throw new apiError.ValidationError('Password', messages.PASSWORD_REQUIRED);

            // var salt = await bcrypt.genSaltSync(10);
            // var hash = await bcrypt.hashSync(details.password, salt);
            if (!hash) throw errorHandler.InternalServerError();
            details.password = hash;

            let newUser = await UserService.createUser(details);
            delete newUser.password;
            delete newUser.created_at;
            delete newUser.updated_at;

            res.send(ResponseService.success({ userName: newUser.fullName }));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));

        }

    }
    async updatePassword(req, res) {
        try {
            let request = { ...req.body };
            if (!request.employeeCode) throw new apiError.ValidationError('Employee ID', messages.EMPLOYEE_CODE);
            if (!request.oldPassword) throw new apiError.ValidationError('Old Password', messages.PASSWORD_REQUIRED);
            let userCheck = await UserService.getUser({ employeeCode: request.employeeCode })
            if (!userCheck) throw new apiError.ValidationError('employeeCode', messages.INVALID_EMPCODE);

            // var salt = await bcrypt.genSaltSync(10);
            // var hash = await bcrypt.hashSync(request.newPassword, salt);
            if (!hash) throw errorHandler.InternalServerError();
            request.newPassword = hash;

            delete request.oldPassword;

            let updates = await UserService.updateUser({ employeeCode: request.employeeCode }, { password: request.newPassword })

            res.send(ResponseService.success({ updates }));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));

        }

    }
    async resetPassword(req, res) {
    }

    createProduct = async (req, res) => {
        try {
            let request = { ...req.body }

            if (request.name) throw new apiError.ValidationError('productName', messages.PRODUCT_NAME_REQUIRED);
            if (request.userId) throw new apiError.ValidationError('productName', messages.USER_ID_REQUIRED);

            let criteria = {
                userId: request.userId,
                name: request.name
            }
            const product = await ProductService.getProduct(criteria);
            if (product) throw new apiError.ValidationError('productName', messages.PRODUCT_EXISTS);

            let response = await ProductService.createProduct(request)


            res.send(ResponseService.success(response));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));
        }

    }
    getMyProduct = async (req, res) => {
        try {
            let request = { ...req.params }
            if (request.userId) throw new apiError.ValidationError('productName', messages.USER_ID_REQUIRED);

            let response = await ProductService.getAllProducts(request);
            res.send(ResponseService.success(response));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));
        }

    }
    updateProduct = async (req, res) => {
        try {
            let request = { ...req.params }
            if (request.userId) throw new apiError.ValidationError('productName', messages.USER_ID_REQUIRED);
            if (request.productId) throw new apiError.ValidationError('productName', messages.PRODUCT_ID_REQUIRED);

            const product = await ProductService.getProduct({ id: request.productId });
            if (!product) throw new apiError.ValidationError('productName', messages.NO_PRODUCT);

            let criteria = {
                id: request.productId
            }
            delete request.productId;

            let response = await ProductService.updateProduct(criteria, request)

            res.send(ResponseService.success(response));
        }
        catch (err) {
            res.status(err.status || 500).send(ResponseService.failure(err));
        }

    }

}

module.exports = new AuthController;
