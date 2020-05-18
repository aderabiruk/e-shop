export interface IPaginationResponse {
    data: any[];
    metadata: {
        pagination: {
            page: number;
            limit: number;
            numberOfPages: number;
            numberOfResults: number;
        }
    }
};

export const PaginationAdapter = (data: any[], page: number, limit: number, count: number = 0): IPaginationResponse => {
    return {
        data: data,
        metadata: {
            pagination: {
                page: page,
                limit: limit,
                numberOfPages: Math.ceil(count / limit),
                numberOfResults: count, 
            }
        }
    }
};