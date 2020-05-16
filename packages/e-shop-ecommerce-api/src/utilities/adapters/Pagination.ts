export interface IPaginationResponse {
    data: any[];
    metadata: {
        pagination: {
            page: number;
            limit: number;
        }
    }
};

export const PaginationAdapter = (data: any[], page: number, limit: number) => {
    return {
        data: data,
        metadata: {
            pagination: {
                page: page,
                limit: limit
            }
        }
    }
};