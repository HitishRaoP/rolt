import { ApiResponse } from '@rolt/types';

export const sendResponse = <T>({
    res,
    statusCode,
    message,
    data
}: ApiResponse<T>) => {
    res.status(statusCode)
        .json({
            message,
            data
        });
};

