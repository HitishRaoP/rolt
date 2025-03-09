import { Response } from 'express';

export type ApiResponse<T> = {
	res: Response;
	statusCode: number;
	message: string;
	data?: T;
};
