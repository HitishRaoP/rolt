import { ApiResponse } from '@rolt/types/Api';

export const sendResponse = <T>({
	res,
	statusCode,
	message,
	data,
}: ApiResponse<T>) => {
	res.status(statusCode).json({
		message,
		data,
	});
};
