import { useRef, useState } from 'react';
import { useStore } from './Utils/useStore';
import style from './form.module.css';

const sendData = (formData) => {
	console.log(formData);
};

const errors = {
	passwordValueError:
		'Пароль не должен содержать пробелов. Пароль должен состоять из букв и цифр',
	passwordMinLengthError: 'Пароль не должен быть короче 6-и символов',
	passwordMaxLengthError: 'Пароль не должен быть длиннее 20-и символов',
	passwordNotMatch: 'Пароль не совпадает!',
};

export const Form = () => {
	const { getState, updateState, resetState } = useStore();
	const [passwordError, setPasswordError] = useState(null);
	const [retryPasswordError, setRetryPasswordError] = useState(null);
	const submitButtonRef = useRef(null);

	const onSubmit = (event) => {
		event.preventDefault();
		sendData(getState());
		resetState();
	};

	let currentError = null;
	const onChange = ({ target }) => {
		if (target.name === 'password') {
			if (!/^[\wS]*$/.test(target.value)) {
				console.log('пароль не подходит');
				currentError = errors.passwordValueError;
			}
		}
		if (target.name === 'retryPassword') {
			if (target.value === password) {
				submitButtonRef.current.focus();
			}
		}
		setPasswordError(currentError);
		return updateState(target.name, target.value);
	};

	const onBlur = ({ target }) => {
		if (target.name === 'password') {
			if (target.value.length < 6) {
				currentError = errors.passwordMinLengthError;
			}
			if (target.value.length > 20) {
				currentError = errors.passwordMaxLengthError;
			}
			setPasswordError(currentError);
		}
		if (target.name === 'retryPassword') {
			if (target.value !== password) {
				currentError = errors.passwordNotMatch;
			}
			setRetryPasswordError(currentError);
		}
	};

	const { email, password, retryPassword } = getState();

	return (
		<div className={style.Form}>
			<form onSubmit={onSubmit}>
				<div className={style.inputName}>Email</div>
				<input
					type="email"
					name="email"
					value={email}
					placeholder="Email"
					onChange={onChange}
				/>
				<div className={style.inputName}>Пароль</div>
				<input
					type="password"
					name="password"
					value={password}
					placeholder="Password"
					onChange={onChange}
					onBlur={onBlur}
				/>
				{passwordError && <div className={style.error}>{passwordError}</div>}
				<div className={style.inputName}>Повтор пароля</div>
				<input
					type="password"
					name="retryPassword"
					className={passwordError === null ? style.input : style.inputError}
					value={retryPassword}
					placeholder="Password"
					onChange={onChange}
					onBlur={onBlur}
					disabled={passwordError !== null}
				/>
				{retryPasswordError && <div className={style.error}>{retryPasswordError}</div>}
				<button
					ref={submitButtonRef}
					className={
						passwordError === null && retryPasswordError === null
							? style.button
							: style.buttonError
					}
					type="submit"
					disabled={passwordError !== null || retryPasswordError !== null}
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
