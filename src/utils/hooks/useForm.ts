import { useCallback, useEffect, useRef, useState } from 'react';
export default function useForm<FormType, FormKey extends keyof FormType>(
	initalState: FormType,
	validators: {
		[key: string]:
			| ((value, form?: FormType) => string | void)[]
			| ((value, form?: FormType) => string | void);
	}
) {
	const [formData, setFormData] = useState<FormType>(initalState);
	const errors = useRef<Map<string, string[]>>(new Map());
	const formHandlers = useRef<Map<string, WeakMap<any, (e: any) => void>>>(new Map());
	const touchedFields = useRef<Set<FormKey>>(new Set());
	useEffect(() => {
		return () => {
			errors.current.clear();
			formHandlers.current.clear();
		};
	}, []);
	const resetForm = useCallback(() => {
		errors.current.clear();
		formHandlers.current.clear();
		setFormData(initalState);
	}, []);
	const registerHandler = useCallback((formKey: string, formValue: { value: any } | string) => {
		let handlers = formHandlers.current.has(formKey)
			? formHandlers.current.get(formKey)
			: new Map<any, (e: any) => void>();
		formHandlers.current.set(formKey, handlers!);
		let registeredHandler;
		if (typeof formValue === 'object' && formValue.value) {
			if (handlers?.has(formValue.value)) {
				return handlers?.get(formValue.value);
			} else {
				registeredHandler = () => {
					setFormData((form) => {
						const newForm = { ...form };
						dotSetValue(newForm, formKey, formValue.value);
						return newForm;
					});
				};
				handlers?.set(formValue.value, registeredHandler);
			}
		} else if (typeof formValue === 'string') {
			if (handlers?.has(formValue)) {
				return handlers?.get(formValue);
			} else {
				registeredHandler = (e: any) => {
					setFormData((form) => {
						let newValue = dotGetValue(e, formValue || '');
						const newForm = {
							...form,
						};
						dotSetValue(newForm, formKey, newValue);
						return newForm;
					});
				};
				handlers?.set(formValue, registeredHandler);
			}
		} else {
			throw new Error(`${formKey} 的 handler 无法获取有效的值`);
		}
		return registeredHandler;
	}, []);
	for (const fieldKey in validators) {
		const fieldErrors = (
			(typeof validators[fieldKey] === 'function'
				? [validators[fieldKey]]
				: validators[fieldKey]) as Array<any>
		)
			.map((func) => {
				const formV = dotGetValue(formData, fieldKey);
				if (formV === undefined) {
					throw new Error('invalid validator: ' + fieldKey);
				}
				return func(formV, formData);
			})
			.filter((err) => !!err);
		if (fieldErrors.length > 0) {
			errors.current.set(fieldKey, fieldErrors as string[]);
		} else {
			errors.current.delete(fieldKey);
		}
	}
	return {
		register: registerHandler,
		formData,
		formErrors: errors.current,
		resetForm,
	};
}

function dotSetValue(target, path: string, value) {
	if (target === undefined || target === null) {
		throw new ReferenceError(`${path} does not exist in undefined`);
	}
	const pathArr = path.split('.');
	if (pathArr.length === 1) {
		return (target[pathArr[0]] = value);
	}
	return dotSetValue(target[pathArr.shift()!], pathArr.join('.'), value);
}
function dotGetValue(target, path: string) {
	if (target === undefined || target === null) {
		throw new ReferenceError(`${path} does not exist in undefined`);
	}
	const pathArr = path.split('.');
	if (pathArr.length === 1) {
		return target[pathArr[0]];
	}
	return dotGetValue(target[pathArr.shift()!], pathArr.join('.'));
}
