db.CreateUser(
    {
        user: 'admin',
        pwd: 'KJSHas12KG&gd674ggas',
        roles: [
            {
                role: 'userAdminAnyDatabase',
            },
            'readWriteAnyDatabase'
        ]
    }
)

