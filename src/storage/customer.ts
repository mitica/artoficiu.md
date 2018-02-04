
export enum CustomerType {
    INDIVIDUAL = 1,
    LEGAL = 2
}


export interface Customer {
    type: CustomerType
    name: string
    email?: string
    telephone?: string
    address?: string
    idno?: string
    VAT?: string
    bank?: string
    bankCode?: string
    bankAccount?: string
}

export function createFromPostData(data: any): Customer {
    const customer: Customer = {
        type: parseInt(data.personType || data.person_type || data.customerType || data.customer_type) as CustomerType,
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        VAT: data.VAT || data.vat || data.TVA || data.TVACode || data.tvaCode || data.tva_code,
        bank: data.bank,
        bankCode: data.bankCode || data.bank_code,
        bankAccount: data.bankAccount || data.bank_account || data.cba,
    };

    if ([CustomerType.INDIVIDUAL, CustomerType.LEGAL].indexOf(customer.type) < 0) {
        throw new Error(`Invalid customer type: ${customer.type}`);
    }

    if (typeof customer.name !== 'string' || customer.name.trim().length < 2) {
        throw new Error(`Invalid customer name: ${customer.name}`);
    }

    return customer;
}
