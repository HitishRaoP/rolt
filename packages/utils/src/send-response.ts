import { Response } from 'express';
import { ApiResponse } from '@rolt/types';

export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
) => {
    const response: ApiResponse<T> = { message, data };
    res.status(statusCode).json(response);
};