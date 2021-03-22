module.exports.validateRegisterInput = (
	username,
	email,
	password,
	confirmPassword
) => {
	const errors = {};

	// TODO : validate username
	if (username.trim() === '') {
		errors.username = 'Username must not be empty';
	}

	// TODO : validate email
	if (email.trim() === '') {
		errors.email = 'Email must not be empty';
	} else {
		const regEx = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		//? : / / 안에 있는 내용은 정규표현식 검증에 사용되는 패턴이 이 안에 위치함
		//? : / /i 정규표현식에 사용된 패턴이 대소문자를 구분하지 않도록 i를 사용함
		//? : ^ 표시는 처음시작하는 부분부터 일치한다는 표시임
		//? : [0-9a-zA-Z] 하나의 문자가 []안에 위치한 규칙을 따른다는 것으로 숫자와 알파벳 소문지 대문자인 경우를 뜻 함
		//? : * 이 기호는 0또는 그 이상의 문자가 연속될 수 있음을 말함

		if (!email.match(regEx)) {
			errors.email = 'Email must be a valid email address';
		}
	}

	// TODO : validate password
	if (password === '') {
		errors.password = 'Password must not be empty';
	} else if (password !== confirmPassword) {
		errors.confirmPassword = 'Password must match';
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

module.exports.validateLoginInput = (username, password) => {
	const errors = {};

	// TODO : validate username
	if (username.trim() === '') {
		errors.username = 'Username must not be empty';
	}
	// TODO : validate password
	if (password.trim() === '') {
		errors.password = 'Password must not be empty';
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
