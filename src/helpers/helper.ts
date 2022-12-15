export const formatFormData = (event: any) => {
	const { target } = event
	const formData = new FormData(target)
	return Object.fromEntries(formData.entries())
}