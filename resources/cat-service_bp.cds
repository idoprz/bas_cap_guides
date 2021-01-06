using { my.bookshop as my } from '../db/schema';
//Using statement for consuming Business Parther entity
using { metadata as external} from './external/metadata.csn';

service CatalogService @(path:'/browse') {

  @readonly entity Books as SELECT from my.Books {*,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @requires_: 'authenticated-user'
  action submitOrder (book : Books.ID, amount: Integer);

//Service definition for consuming Business Parther entity
  @readonly entity BusinessPartners as projection on external.A_BusinessPartner {
      Key BusinessPartner as ID,
     FirstName,
     MiddleName,
     LastName,
     BusinessPartnerIsBlocked
  };

}
