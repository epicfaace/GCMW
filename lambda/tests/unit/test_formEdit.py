"""
pipenv run python -m unittest tests.unit.test_formEdit
"""
import unittest
from tests.integration.constants import _
from app import app
from chalicelib.models import Response, User, Form, FormOptions
import uuid
import datetime
from chalicelib.routes import form_edit, group_edit, form_render
from unittest.mock import MagicMock


class FormEdit(unittest.TestCase):
    def setUp(self):
        userId = app.get_current_user_id()
        form = Form(
            schema={
                "type": "object",
                "properties": {"amountField": {"type": "number"}},
            },
            uiSchema={"title": "Test"},
            formOptions=FormOptions(paymentInfo={"a": "b"}),
            name="Name",
            cff_permissions={userId: {"owner": True}},
        )
        form.save()
        formId = form.id
        app.current_request = MagicMock()
        app.current_request.context = {"authorizer": {"id": userId}}
        self.formId = formId

    def test_form_edit_normal(self):
        app.current_request.json_body = {
            "name": "New name",
            "schema": {"new": "schema"},
        }
        form_edit(self.formId)
        form = Form.objects.get({"_id": self.formId})
        self.assertEqual(form.name, "New name")
        self.assertEqual(form.schema, {"new": "schema"})

    def test_group_edit(self):
        app.current_request.json_body = {"groups": {"new": "new2"}}
        group_edit(self.formId)
        form = Form.objects.get({"_id": self.formId})
        self.assertEqual(form.name, "Name")
        self.assertEqual(form.formOptions.dataOptions["groups"], {"new": "new2"})

    def test_form_edit_special_chars(self):
        app.current_request.json_body = {
            "name": "New name",
            "schema": {"$ref": "schema"},
            "formOptions": {
                "dataOptions": {"views": [{"a": {"$ref": "hi", "a.b.c": "hu"}}]}
            },
        }
        form_edit(self.formId)
        form = Form.objects.get({"_id": self.formId})
        self.assertEqual(form.name, "New name")
        self.assertEqual(form.schema, {"__$ref": "schema"})
        self.assertEqual(
            form.formOptions.dataOptions["views"][0],
            {"a": {"|ref": "hi", "a||b||c": "hu"}},
        )
        response = form_render(self.formId)
        form = response["res"]
        self.assertEqual(form["name"], "New name")
        self.assertEqual(form["schema"], {"$ref": "schema"})
        self.assertEqual(
            form["formOptions"]["dataOptions"]["views"][0],
            {"a": {"$ref": "hi", "a.b.c": "hu"}},
        )

    def test_form_edit_tags(self):
        app.current_request.json_body = {"tags": ["a", "b", "c"]}
        form_edit(self.formId)
        form = Form.objects.get({"_id": self.formId})
        self.assertEqual(form.tags, ["a", "b", "c"])

    def test_form_edit_tags_blank(self):
        app.current_request.json_body = {"tags": []}
        form_edit(self.formId)
        form = Form.objects.get({"_id": self.formId})
        self.assertEqual(form.tags, [])
