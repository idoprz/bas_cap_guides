const cds = require('@sap/cds');

module.exports = async (srv) => {

    // Add some discount for overstocked books
    srv.after('READ', 'Books', (each) => {
        if (each.stock > 111) each.title += ' -- 11% discount!'
    })

    // Using CDS API
    const businessPartnerService = await cds.connect.to("metadata");
    srv.on('READ', 'BusinessPartners', req => businessPartnerService.tx(req).run(req.query));

}
