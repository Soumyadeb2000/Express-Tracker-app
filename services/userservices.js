exports.getExpenses = (req) => {
    return req.user.getExpenses();
}