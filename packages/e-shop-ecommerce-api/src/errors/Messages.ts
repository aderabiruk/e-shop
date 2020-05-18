const Messages = {
    /**
     * General Error Messages
     */
    UNAUTHORIZED_ERROR: "Authorization Failure: You're not authorized!",
    FORBIDDEN_ERROR: "Authorization Failure: You're not allowed!",
    INTERNAL_SERVER_ERROR: "Internal Error: Something went wrong!",
    NOT_IMPLEMENTED_ERROR: 'Not Implemented!',
    SERVICE_UNAVAILABLE_ERROR: "Service Unavailable!",

    /**
     * Category Error Messages
     */
    CATEGORY_NOT_FOUND: "Category Not Found!",
    CATEGORY_NAME_REQUIRED: "Category name is required!",

    /**
     * City Error Messages
     */
    CITY_NOT_FOUND: "City Not Found!",
    CITY_NAME_REQUIRED: "City name is required!",
    CITY_CODE_REQUIRED: "City code is required!",
    CITY_COUNTRY_REQUIRED: "Country is required!",
    CITY_LOCATION_REQUIRED: "City location is required!",

    /**
     * Country Error Messages
     */
    COUNTRY_NOT_FOUND: "Country Not Found!",
    COUNTRY_NAME_REQUIRED: "Country name is required!",
    COUNTRY_CODE_REQUIRED: "Country code is required!",
    COUNTRY_FLAG_REQUIRED: "Country flag is required!",
    COUNTRY_CURRENCY_NAME_REQUIRED: "Country currency name is required!",
    COUNTRY_CURRENCY_CODE_REQUIRED: "Country currency code is required!",

    /**
     * Customer Error Messages
     */
    CUSTOMER_NOT_FOUND: "Customer not found!",

    /**
     * Discout Error Messages
     */
    DISCOUNT_INVALID_PERCENTAGE: "Invalid percentage provided!",

    /**
     * Order Error Messages
     */
    ORDER_NOT_FOUND: "Order not found!",
    ORDER_ITEMS_REQUIRED: "Items are required!",

    /**
     * Payment Error Messages
     */
    PAYMENT_NOT_FOUND: "Payment not found!",
    PAYMENT_ORDER_REQUIRED: "Order is required!",
    PAYMENT_CUSTOMER_REQUIRED: "Customer is required!",
    PAYMENT_METHOD_REQUIRED: "Payment method is required!",
    PAYMENT_STATUS_REQUIRED: "Payment status is required!",
    PAYMENT_PRICE_REQUIRED: "Payment price is required!",

    /**
     * Payment Method Error Messages
     */
    PAYMENT_METHOD_NOT_FOUND: "Payment method not found!",
    PAYMENT_METHOD_NAME_REQUIRED: "Payment method name required!",

    /**
     * Product Error Messages
     */
    PRODUCT_NOT_FOUND: "Product not found!",
    PRODUCT_NAME_REQUIRED: "Product name is required!",
    PRODUCT_PRICE_REQUIRED: "Product price is required!",
    PRODUCT_QUANTITY_REQUIRED: "Product quantity is required!",
    PRODUCT_IMAGES_REQUIRED: "Product images are required!",
    PRODUCT_CATEOGRY_REQUIRED: "Product category is required!",
    PRODUCT_STORE_REQUIRED: "Product store is required!",
    PRODUCT_WEIGHT_REQUIRED: "Product weight is required!",
    PRODUCT_WIDTH_REQUIRED: "Product width is required!",
    PRODUCT_LENGTH_REQUIRED: "Product length is required!",
    PRODUCT_HEIGHT_REQUIRED: "Product height is required!",

    /**
     * Shipment Error Messages
     */
    SHIPMENT_NOT_FOUND: "Shipment not found!",
    SHIPMENT_ORDER_REQUIRED: "Order is required!",
    SHIPMENT_METHOD_REQUIRED: "Shipment method is required!",
    SHIPMENT_STATUS_REQUIRED: "Shipment status is required!",
    SHIPMENT_TRACKING_CODE_REQUIRED: "Shipment tracking code is required!",


    /**
     * Shipment Method Error Messages
     */
    SHIPMENT_METHOD_NOT_FOUND: "Shipment method not found!",
    SHIPMENT_METHOD_NAME_REQUIRED: "Shipment method name required!",

    /**
     * Store Error Messages
     */
    STORE_NOT_FOUND: "Store Not Found!",
    STORE_NAME_REQUIRED: "Store name is required!",
    STORE_EMAIL_REQUIRED: "Store email is required!",
    STORE_PHONE_NUMBER_REQUIRED: "Store phone number is required!",
    STORE_CITY_REQUIRED: "City is required!",
    STORE_ADDRESS_REQUIRED: "Store address is required!",
    STORE_LOCATION_REQUIRED: "Store location is required!",

    /**
     * Tag Error Messages
     */
    TAG_NOT_FOUND: "Tag Not Found!",
    TAG_NAME_REQUIRED: "Tag name is required!"
};

export default Messages;