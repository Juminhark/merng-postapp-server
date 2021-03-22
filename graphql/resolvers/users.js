const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const {
	validateRegisterInput,
	validateLoginInput,
} = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

const generateToken = (user) => {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
};

module.exports = {
	Query: {
		async getUsers() {
			try {
				const users = await User.find();
				return users;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);

			//* valid: Object.keys(errors).length < 1 ==> error 유무판단, 없으면 true
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ username });
			if (!user) {
				errors.general = 'User not found';
				throw new UserInputError('User not found', { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = 'Wrong credentials';
				throw new UserInputError('Wrong credential', { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) {
			// TODO : Validate user data
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);

			//* valid: Object.keys(errors).length < 1 ==> error 유무판단, 없으면 true
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			// TODO : Make sure user doesn't already exist
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError('User is taken', {
					errors: {
						username: `This ${username} is taken`,
					},
				});
			}

			//  TODO :  hash password and create an auth token
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save();

			const token = generateToken(res);

			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
};
