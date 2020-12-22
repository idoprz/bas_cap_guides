const cds = require('@sap/cds');

module.exports = async (srv) => {

    // Add some discount for overstocked books
    srv.after('READ', 'Books', (each) => {
        if (each.stock > 111) each.title += ' -- 11% discount!'
    })
}
