export const loginUser = (login) => {
    return {
        type: 'LOGIN_USER',
        payload: login,
    };
};

export const logoutUser = () => {
    return {
        type: 'LOGOUT_USER',
    };
};
