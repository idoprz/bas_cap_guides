using CatalogService as service from '../../srv/cat-service';

annotate CatalogService.Books with @(
  UI: {
    SelectionFields: [ ID, title, stock ],
    LineItem: [
      {Value: title}
    ]
  }
);
