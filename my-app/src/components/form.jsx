import { useRef } from 'react';
import { errorsText } from './consts/Consts';
import style from './form.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const Form = () => {
	const fieldsScheme = yup.object().shape({
		email: yup.string().matches(/^[\w]*@[a-z]*\.[a-z]{2,3}$/, errorsText.emailValueError),
		password: yup
			.string()
			.matches(/^[\wS]*$/, errorsText.passwordValueError)
			.max(20, errorsText.passwordMaxLengthError)
			.min(6, errorsText.passwordMinLengthError),
		retryPassword: yup
			.string()
			.test('match', 'Пароль не совпадает', (value) => value === getValues('password')),
	});

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm({
		email: '',
		password: '',
		retryPassword: '',
		resolver: yupResolver(fieldsScheme),
	});
	const submitButtonRef = useRef(null);
	const emailError = errors.email?.message;
	const passwordError = errors.password?.message;
	const retryPasswordError = errors.retryPassword?.message;

	const retryPasswordProps = {
		onChange: ({ target }) => {
			if (target.value === getValues('password')) {
				return submitButtonRef.current.focus();
			}
		},
	};

	const onSubmit = (formData) => {
		console.log(formData);
	};

	return (
		<div className={style.Form}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={style.inputName}>Email</div>
				<input type="text" name="email" placeholder="Email" {...register('email')} />
				{emailError && <div className={style.error}>{emailError}</div>}
				<div className={style.inputName}>Пароль</div>
				<input
					type="password"
					name="password"
					placeholder="Password"
					{...register('password')}
				/>
				{passwordError && <div className={style.error}>{passwordError}</div>}
				<div className={style.inputName}>Повтор пароля</div>
				<input
					type="password"
					name="retryPassword"
					className={!passwordError ? style.input : style.inputError}
					placeholder="Password"
					{...register('retryPassword', retryPasswordProps)}
					disabled={!!passwordError}
				/>
				{retryPasswordError && <div className={style.error}>{retryPasswordError}</div>}
				<button
					ref={submitButtonRef}
					className={!passwordError ? style.button : style.buttonError}
					type="submit"
					disabled={!!passwordError && !!emailError}
				>
					Зарегистрироваться
				</button>
			</form>
		</div>
	);
};
