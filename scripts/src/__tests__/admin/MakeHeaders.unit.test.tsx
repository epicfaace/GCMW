import { IDataOptionView } from "../../admin/FormEdit/FormEdit.d";
import Headers from "../../admin/util/Headers";

it("renders default columns for main view in response table", () => {
  const dataOptionView: IDataOptionView = {
    id: "main",
    displayName: "Main"
  };
  const schema = {
    type: "object",
    properties: {
      name: {
        type: "object",
        properties: {
          first: { type: "string" },
          last: { type: "string" }
        }
      },
      parents: {
        type: "object",
        properties: {
          age: { type: "number" }
        }
      }
    }
  };
  const result = Headers.makeHeadersFromDataOption(dataOptionView, schema);
  expect(result).toMatchSnapshot();
});

it("renders custom columns for main view in response table", () => {
  const dataOptionView: IDataOptionView = {
    id: "main",
    displayName: "Main",
    columns: [{ label: "First Names", value: "parents.name.first" }]
  };
  const schema = {
    type: "object",
    properties: {
      name: {
        type: "object",
        properties: {
          first: { type: "string" },
          last: { type: "string" }
        }
      },
      parents: {
        type: "object",
        properties: {
          age: { type: "number" }
        }
      }
    }
  };
  const result = Headers.makeHeadersFromDataOption(dataOptionView, schema);
  expect(result).toMatchSnapshot();
  expect(
    result[0].accessor({ parents: { name: { first: "a", last: "b" } } })
  ).toEqual("a");
});

it("renders custom columns for unwind by view in response table", () => {
  const dataOptionView: IDataOptionView = {
    id: "main",
    displayName: "Main",
    columns: [
      { label: "First Names", value: "parents.name.first" },
      "name.last"
    ],
    unwindBy: "parents"
  };
  const schema = {
    type: "object",
    properties: {
      name: {
        type: "object",
        properties: {
          first: { type: "string" },
          last: { type: "string" }
        }
      },
      parents: {
        type: "object",
        properties: {
          age: { type: "number" }
        }
      }
    }
  };
  const result = Headers.makeHeadersFromDataOption(dataOptionView, schema);
  expect(result).toMatchSnapshot();
});

it("renders custom columns with multiple values for main view in response table", () => {
  const dataOptionView: IDataOptionView = {
    id: "main",
    displayName: "Main",
    columns: [
      { label: "Names", value: ["parents.name.last", "parents.name.first"] }
    ]
  };
  const schema = {
    type: "object",
    properties: {
      name: {
        type: "object",
        properties: {
          first: { type: "string" },
          last: { type: "string" }
        }
      },
      parents: {
        type: "object",
        properties: {
          age: { type: "number" }
        }
      }
    }
  };
  const result = Headers.makeHeadersFromDataOption(dataOptionView, schema);
  expect(result).toMatchSnapshot();
  expect(
    result[0].accessor({ parents: { name: { first: "a", last: "b" } } })
  ).toEqual("b a");
});

it("renders custom columns with no spaces for main view in response table", () => {
  const dataOptionView: IDataOptionView = {
    id: "main",
    displayName: "Main",
    columns: [
      {
        label: "Names",
        noSpace: true,
        value: ["parents.name.last", "parents.name.first"]
      }
    ]
  };
  const schema = {
    type: "object",
    properties: {
      name: {
        type: "object",
        properties: {
          first: { type: "string" },
          last: { type: "string" }
        }
      },
      parents: {
        type: "object",
        properties: {
          age: { type: "number" }
        }
      }
    }
  };
  const result = Headers.makeHeadersFromDataOption(dataOptionView, schema);
  expect(result).toMatchSnapshot();
  expect(
    result[0].accessor({ parents: { name: { first: "a", last: "b" } } })
  ).toEqual("ba");
});

it("renders custom columns with constant values for main view in response table", () => {
  const dataOptionView: IDataOptionView = {
    id: "main",
    displayName: "Main",
    columns: [
      {
        label: "Names",
        noSpace: true,
        value: [
          { mode: "constant", value: "http://google.com/?q=" },
          "parents.name.first"
        ]
      }
    ]
  };
  const schema = {
    type: "object",
    properties: {
      name: {
        type: "object",
        properties: {
          first: { type: "string" },
          last: { type: "string" }
        }
      },
      parents: {
        type: "object",
        properties: {
          age: { type: "number" }
        }
      }
    }
  };
  const result = Headers.makeHeadersFromDataOption(dataOptionView, schema);
  expect(result).toMatchSnapshot();
  expect(
    result[0].accessor({ parents: { name: { first: "a", last: "b" } } })
  ).toEqual("http://google.com/?q=a");
});
