const initialState = {
    login: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                login: action.payload,
            };
        case 'LOGOUT_USER':
            return {
                ...state,
                login: null,
            };
        default:
            return state;
    }
};

export default authReducer;
