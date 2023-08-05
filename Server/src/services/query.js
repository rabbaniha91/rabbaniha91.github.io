const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_LIMIT_PAGE = 0;

function pagination(query){
    const limit = Math.abs(query.limit) || DEFAULT_LIMIT_PAGE;
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;

    const skip = (page - 1) * limit;

    return {
        limit,
        skip
    }
}

module.exports = pagination;