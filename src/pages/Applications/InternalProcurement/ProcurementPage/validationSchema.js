import * as Yup from 'yup';

export const procurementSchema = Yup.object().shape({
  department_purchase_id: Yup.string()
    .required('დეპარტამენტის არჩევა სავალდებულოა'),
    
  objective: Yup.string()
    .required('შესყიდვის ობიექტის აღწერა სავალდებულოა')
    .min(3, 'მინიმუმ 3 სიმბოლო')
    .max(500, 'მაქსიმუმ 500 სიმბოლო'),
    
  deadline: Yup.date()
    .required('თარიღის მითითება სავალდებულოა')
    .min(new Date(), 'თარიღი არ შეიძლება იყოს წარსულში'),
    
  short_period_reason: Yup.string()
    .when('deadline', {
      is: (deadline) => {
        const daysDiff = (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24);
        return daysDiff < 7;
      },
      then: () => Yup.string().required('მცირე ვადის მიზეზის მითითება სავალდებულოა'),
      otherwise: () => Yup.string(),
    })
    .max(500, 'მაქსიმუმ 500 სიმბოლო'),

  requested_procurement_object_exceed: Yup.string()
    .required('ველის შევსება სავალდებულოა')
    .max(500, 'მაქსიმუმ 500 სიმბოლო'),

  stock_purpose: Yup.string()
    .required('მარაგის მიზნის მითითება სავალდებულოა')
    .max(500, 'მაქსიმუმ 500 სიმბოლო'),

  delivery_address: Yup.string()
    .required('მიწოდების მისამართი სავალდებულოა')
    .max(200, 'მაქსიმუმ 200 სიმბოლო'),

  brand_model: Yup.string()
    .required('მარკა/მოდელის მითითება სავალდებულოა')
    .max(200, 'მაქსიმუმ 200 სიმბოლო'),

  alternative: Yup.string()
    .required('ალტერნატივის შესაძლებლობის მითითება სავალდებულოა')
    .max(200, 'მაქსიმუმ 200 სიმბოლო'),

  competetive_price: Yup.string()
    .required('კონკურენტული ფასის მითითება სავალდებულოა')
    .max(200, 'მაქსიმუმ 200 სიმბოლო'),

  who_pay_amount: Yup.string()
    .required('გადამხდელის მითითება სავალდებულოა')
    .max(200, 'მაქსიმუმ 200 სიმბოლო'),

  name_surname_of_employee: Yup.string()
    .required('თანამშრომლის სახელი და გვარი სავალდებულოა')
    .matches(/^[a-zA-Zა-ჰ\s]+$/, 'მხოლოდ ასოები და ჰარები')
    .min(5, 'მინიმუმ 5 სიმბოლო')
    .max(100, 'მაქსიმუმ 100 სიმბოლო'),

  reason: Yup.string()
    .required('შესყიდვის საჭიროების მითითება სავალდებულოა')
    .max(500, 'მაქსიმუმ 500 სიმბოლო'),

  planned_next_month: Yup.string()
    .required('მომავალი თვის გეგმის მითითება სავალდებულოა')
    .max(200, 'მაქსიმუმ 200 სიმბოლო'),
}); 