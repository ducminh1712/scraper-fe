import config from 'config';
import { authHeader } from '../_helpers';

export const executionService = {
    getExecutions,
    submitExecution
};

function getExecutions(pageIndex, pageSize) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/executions?pageIndex=${pageIndex}&pageSize=${pageSize}`, requestOptions)
        .then(handleResponse);
}

function submitExecution(urls) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader('application/json'),
        body: JSON.stringify({ urls }),
    };

    return fetch(`${config.apiUrl}/scrap`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}