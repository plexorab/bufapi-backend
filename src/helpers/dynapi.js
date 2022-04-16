sql.connect(config, err => {
    // ... error checks

    const request = new sql.Request()
    request.stream = true // You can set streaming differently for each request
    request.query('select * from verylargetable') // or request.execute(procedure)

    request.on('recordset', columns => {
        // Emitted once for each recordset in a query
    })

    request.on('row', row => {
        // Emitted for each row in a recordset
    })

    request.on('rowsaffected', rowCount => {
        // Emitted for each `INSERT`, `UPDATE` or `DELETE` statement
        // Requires NOCOUNT to be OFF (default)
    })

    request.on('error', err => {
        // May be emitted multiple times
    })

    request.on('done', result => {
        // Always emitted as the last one
    })
})

sql.on('error', err => {
    // ... error handler
})
