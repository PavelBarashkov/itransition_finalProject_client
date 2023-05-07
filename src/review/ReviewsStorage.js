import {makeAutoObservable} from "mobx";

export  class ReviewsStorage {
    constructor() {
        this._product = [];
        this._types = [];
        this._tags = [];
        this._rating = [];
        this._reviews = null;
        this._reviewId = null;
        this._selectedProduct = [];
        this._selectedType = {};
        this._selectedTag = [];
        this._page = 1;
        this._totalCount = 0;
        this._limit = 3;

        makeAutoObservable(this);
    }

    setProduct(product) {
        this._product = product;
    }

    setReviewId(review) {
        this._reviewId = review
    }

    setTypes(types) {
        this._types = types;
    }

    setTags(tags) {
        this._tags = tags;
    }

    setRating(rating) {
        this._rating = rating;
    }

    setReviews(reviews) {
        this._reviews = reviews;
    }

    setSelectedProduct(product) {
        this._selectedProduct = product;
    }
    setSelectedType(type) {
        this.setPage(1)
        this._selectedType = type;
    }
    setSelectedTag(Tag) {
        this.setPage(1)
        this._selectedTag = Tag;
    }

    setPage(page) {
        this._page = page;
    }
    setTotalCount(count) {
        this._totalCount = count;
    }

    get product() {
        return this._product;
    }

    get reviewId() {
        return this._reviewId;
    }

    get types() {
        return this._types;
    }

    get tags() {
        return this._tags;
    }

    get reviews() {
        return this._reviews;
    }

    get selectedProduct() {
        return this._selectedProduct;
    }

    get selectedType() {
        return this._selectedType;
    }
    get selectedTag() {
        return this._selectedTag;
    }
    get totalCount() {
        return this._totalCount;
    }
    get page() {
        return this._page;
    }
    get limit() {
        return this._limit;
    }
}