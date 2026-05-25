import API from './axios';

export const getAnalytics = async () => {

    const res = await API.get(
        '/result/analytics'
    );

    return res.data;
};