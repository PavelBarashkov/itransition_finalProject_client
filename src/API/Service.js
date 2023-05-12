import { $authHost, $host } from "./http/index";

export class Service {

    static async getTypes() {
        const response = await $host.get('api/type');
        return response;
    }

    static async getReviews(typeId, tagId, page, limit=5) {
        const {data} = await $host.get('/api/review/reviews', {
            params:
                {
                    typeId, 
                    tagId, 
                    page, 
                    limit
                }
            });
        return data;
    }

    static async getUserId(id) {
        const response = await $host.get('api/user/' + id);
        return response;
    }

    static async getUsers() {
        const response = await $authHost.get('/api/user/');
        return response;
    }
    static  async deleteUserId(id) {
        const response =  await $authHost.delete(`/api/user/users/${id}`);
        return response;
    }
    static async dataUpdateId(id, status='active', role='USER') {
        const response = await $authHost.put(`/api/user/user/${id}`, {status, role});
        return response;
    } 

    static async getTags() {
        const {data} = await $host.get('api/tag');
        return data;
    }

    static async getRewiewId(id) {
        const {data} = await $host.get('api/review/' + id);
        return data;
    }

    static async getReviewsUserId(id) {
        const {data} = await $authHost.get(`api/review/user/${id}`);
        return data;
    }

    static async getReviewForProduct(id) {
        const {data}  = await $host.get(`/api/review/product/${id}`);
        return data;
    }

    static async createReview(image = null, type, title, product, body, rating, userId, tag) {
        const {data} = await $authHost.post('api/review/create', {
            image, type, title, product, body, rating, userId, tag
        });
        return {data};
    }

    static async updateReview(id, title, name, body, rating, tag, type, imageId) {
        const {data} = await $authHost.put(`api/review/update/${id}`, { title, name, body, rating, tag, type, imageId });
        return data;
    }

    static async deleteReview(id) {
        const response = await $authHost(`api/review/delete/${id}`);
        return response;
    }

    static async sendComment(userId, userName, reviewId, body=null) {
        const response = await $host.post('api/comment/create', { userId, userName, reviewId, body });
        return response;
    }

    static async postRating(userId, productId, rating) {
        const response = await $authHost.post('/api/rating', {userId, productId, rating});
        return response;
    }

    static async uploadImg(file) {
        const response = await $authHost.post('api/image/upload', file);
        return response;
    }


    static async createType(name) {
        const response = await $authHost.post('api/type/create', {name});
        return response;
    }

    static async createTag(name) {
        const response = await $authHost.post('api/tag/create', {name});
        return response;
    }

    static async like(reviewId ,userId) {
        const response = await $authHost.post(`/api/review/review/${reviewId}/like`, {userId});
        return response;
    }

    static async getProducts() {
        const response = await $authHost.get('/api/product');
        return response;
    }

    static async getSearch(query) {
        const {data} = await $host.get('/api/search/search', {params: {
            query: query
        }});

        return data;    
    }
}