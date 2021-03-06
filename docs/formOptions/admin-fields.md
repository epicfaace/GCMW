You can add admin fields in order to create fields that are not visible for regular users of the form, but are visible to admins. Admin fields are automatically hidden for most users. They are only shown for users that have a Responses_Edit or owner permission to the form itself.

Let's add an admin field called "comments", which only admins can edit. First, add the field to `formOptions.adminFields`:

```json
{
  "adminFields": ["comments"]
}
```

Then, add the "comments" field to the schema:

```json
{
  "properties": {
    ...,
    "comments": {"type": "string"}
  }
}
```

Finally, add "comments" to the `ui:order` attribute of the `uiSchema` as well:

```json
{
  "ui:order": [
    ...,
    "comments"
  ]
}
```

An admin can then view / edit a particular response from the response list, and they will see the "comments" field.

!!! warning
    Admin fields are only hidden to the user on the frontend. However, there is currently no backend check that prevents regular users from modifying this field. Thus, don't store any sensitive information in these fields, as this is a security flaw that allows any users to change this field with a specially crafted user request. It is always possible for non-admins to modify these fields.