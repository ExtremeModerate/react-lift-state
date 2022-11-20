export const currencyFormat = (value: number, decimal = 2) => {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimal,
    });
};
export default currencyFormat;
