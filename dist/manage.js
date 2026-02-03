"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/manage.tsx
var manage_exports = {};
__export(manage_exports, {
  default: () => Manage
});
module.exports = __toCommonJS(manage_exports);
var import_api3 = require("@raycast/api");
var import_react2 = require("react");

// src/utils/create.tsx
var import_api2 = require("@raycast/api");
var import_react = require("react");

// src/utils/storage.ts
var import_api = require("@raycast/api");
var locale = Intl.DateTimeFormat().resolvedOptions().locale;
async function getApps() {
  return (await (0, import_api.getApplications)()).filter((app) => typeof app.bundleId === "string").sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: "base" }));
}
async function getStorage() {
  const apps = await getApps();
  const bundleIds = new Set(apps.map((app) => app.bundleId));
  try {
    return JSON.parse(await import_api.LocalStorage.getItem("badges") || "[]").filter((badge) => bundleIds.has(badge.app.bundleId));
  } catch {
    return [];
  }
}
async function setStorage(badges) {
  await import_api.LocalStorage.setItem("badges", JSON.stringify(
    badges.sort((a, b) => a.app.name.localeCompare(b.app.name, locale, { sensitivity: "base" }))
  ));
}
async function addBadge(bundleId) {
  const app = (await getApps()).find((app2) => app2.bundleId === bundleId);
  const badges = await getStorage();
  if (!app || badges.some((badge) => badge.app.bundleId === bundleId))
    return;
  badges.push({ app });
  await setStorage(badges);
}
async function deleteBadge(bundleId) {
  await setStorage((await getStorage()).filter((badge) => badge.app.bundleId !== bundleId));
}

// src/utils/create.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Create(props) {
  const { pop } = (0, import_api2.useNavigation)();
  const [isLoading, setIsLoading] = (0, import_react.useState)(true);
  const [apps, setApps] = (0, import_react.useState)([]);
  (0, import_react.useEffect)(() => {
    (async () => {
      setApps(await getApps());
      setIsLoading(false);
    })();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_api2.Form,
    {
      isLoading,
      navigationTitle: "Create Badge",
      actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_api2.Action.SubmitForm,
        {
          title: "Submit",
          onSubmit: (values) => addBadge(values.bundleId).then(props.onSubmit).then(pop)
        }
      ) }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Dropdown, { id: "bundleId", title: "Application", children: apps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_api2.Form.Dropdown.Item,
          {
            value: app.bundleId,
            title: app.name,
            icon: { fileIcon: app.path }
          },
          app.bundleId
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_api2.Form.Description, { text: "Applications must be open or kept in the Dock to count badges. Additionally, Raycast must have Automation and Accessibility permissions enabled." })
      ]
    }
  );
}

// src/manage.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function Manage() {
  const { push } = (0, import_api3.useNavigation)();
  const [isLoading, setIsLoading] = (0, import_react2.useState)(true);
  const [badges, setBadges] = (0, import_react2.useState)([]);
  (0, import_react2.useEffect)(() => {
    (async () => {
      setBadges(await getStorage());
      setIsLoading(false);
    })();
  }, []);
  const reload = async () => setBadges(await getStorage());
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_api3.List, { isLoading, children: [
    badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_api3.List.Item,
      {
        title: badge.app.name,
        icon: { fileIcon: badge.app.path },
        accessories: [{ text: badge.app.path }],
        actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_api3.ActionPanel, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            import_api3.Action,
            {
              title: "Create Badge",
              icon: import_api3.Icon.Plus,
              onAction: () => push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Create, { onSubmit: reload }))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.ActionPanel.Section, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            import_api3.Action,
            {
              title: "Delete Badge",
              icon: import_api3.Icon.Trash,
              style: import_api3.Action.Style.Destructive,
              shortcut: { modifiers: ["ctrl"], key: "x" },
              onAction: () => (0, import_api3.confirmAlert)({
                title: badge.app.name,
                message: "Are you sure you want to delete this badge?",
                primaryAction: {
                  title: "Delete",
                  style: import_api3.Alert.ActionStyle.Destructive,
                  onAction: async () => {
                    await deleteBadge(badge.app.bundleId);
                    await reload();
                  }
                }
              })
            }
          ) })
        ] })
      },
      badge.app.bundleId
    )),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      import_api3.List.EmptyView,
      {
        icon: import_api3.Icon.BellDisabled,
        actions: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_api3.ActionPanel, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          import_api3.Action,
          {
            title: "Create Badge",
            icon: import_api3.Icon.Plus,
            onAction: () => push(/* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Create, { onSubmit: reload }))
          }
        ) })
      }
    )
  ] });
}
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL21hbmFnZS50c3giLCAiLi4vc3JjL3V0aWxzL2NyZWF0ZS50c3giLCAiLi4vc3JjL3V0aWxzL3N0b3JhZ2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgQmFkZ2UgfSBmcm9tICcuL3V0aWxzL3N0b3JhZ2UudHMnXG5pbXBvcnQgeyBBY3Rpb24sIEFjdGlvblBhbmVsLCBBbGVydCwgY29uZmlybUFsZXJ0LCBJY29uLCBMaXN0LCB1c2VOYXZpZ2F0aW9uIH0gZnJvbSAnQHJheWNhc3QvYXBpJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQ3JlYXRlIH0gZnJvbSAnLi91dGlscy9jcmVhdGUudHN4J1xuaW1wb3J0IHsgZGVsZXRlQmFkZ2UsIGdldFN0b3JhZ2UgfSBmcm9tICcuL3V0aWxzL3N0b3JhZ2UudHMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE1hbmFnZSgpIHtcbiAgY29uc3QgeyBwdXNoIH0gPSB1c2VOYXZpZ2F0aW9uKClcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IFtiYWRnZXMsIHNldEJhZGdlc10gPSB1c2VTdGF0ZTxCYWRnZVtdPihbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBzZXRCYWRnZXMoYXdhaXQgZ2V0U3RvcmFnZSgpKVxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKVxuICAgIH0pKClcbiAgfSwgW10pXG5cbiAgY29uc3QgcmVsb2FkID0gYXN5bmMgKCkgPT4gc2V0QmFkZ2VzKGF3YWl0IGdldFN0b3JhZ2UoKSlcblxuICByZXR1cm4gKFxuICAgIDxMaXN0IGlzTG9hZGluZz17aXNMb2FkaW5nfT5cbiAgICAgIHtiYWRnZXMubWFwKGJhZGdlID0+IChcbiAgICAgICAgPExpc3QuSXRlbVxuICAgICAgICAgIGtleT17YmFkZ2UuYXBwLmJ1bmRsZUlkfVxuICAgICAgICAgIHRpdGxlPXtiYWRnZS5hcHAubmFtZX1cbiAgICAgICAgICBpY29uPXt7IGZpbGVJY29uOiBiYWRnZS5hcHAucGF0aCB9fVxuICAgICAgICAgIGFjY2Vzc29yaWVzPXtbeyB0ZXh0OiBiYWRnZS5hcHAucGF0aCB9XX1cbiAgICAgICAgICBhY3Rpb25zPXsoXG4gICAgICAgICAgICA8QWN0aW9uUGFuZWw+XG4gICAgICAgICAgICAgIDxBY3Rpb25cbiAgICAgICAgICAgICAgICB0aXRsZT1cIkNyZWF0ZSBCYWRnZVwiXG4gICAgICAgICAgICAgICAgaWNvbj17SWNvbi5QbHVzfVxuICAgICAgICAgICAgICAgIG9uQWN0aW9uPXsoKSA9PiBwdXNoKDxDcmVhdGUgb25TdWJtaXQ9e3JlbG9hZH0gLz4pfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8QWN0aW9uUGFuZWwuU2VjdGlvbj5cbiAgICAgICAgICAgICAgICA8QWN0aW9uXG4gICAgICAgICAgICAgICAgICB0aXRsZT1cIkRlbGV0ZSBCYWRnZVwiXG4gICAgICAgICAgICAgICAgICBpY29uPXtJY29uLlRyYXNofVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e0FjdGlvbi5TdHlsZS5EZXN0cnVjdGl2ZX1cbiAgICAgICAgICAgICAgICAgIHNob3J0Y3V0PXt7IG1vZGlmaWVyczogWydjdHJsJ10sIGtleTogJ3gnIH19XG4gICAgICAgICAgICAgICAgICBvbkFjdGlvbj17KCkgPT4gY29uZmlybUFsZXJ0KHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IGJhZGdlLmFwcC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIGJhZGdlPycsXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlBY3Rpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0RlbGV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IEFsZXJ0LkFjdGlvblN0eWxlLkRlc3RydWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICAgIG9uQWN0aW9uOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBkZWxldGVCYWRnZShiYWRnZS5hcHAuYnVuZGxlSWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByZWxvYWQoKVxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L0FjdGlvblBhbmVsLlNlY3Rpb24+XG4gICAgICAgICAgICA8L0FjdGlvblBhbmVsPlxuICAgICAgICAgICl9XG4gICAgICAgIC8+XG4gICAgICApKX1cblxuICAgICAgPExpc3QuRW1wdHlWaWV3XG4gICAgICAgIGljb249e0ljb24uQmVsbERpc2FibGVkfVxuICAgICAgICBhY3Rpb25zPXsoXG4gICAgICAgICAgPEFjdGlvblBhbmVsPlxuICAgICAgICAgICAgPEFjdGlvblxuICAgICAgICAgICAgICB0aXRsZT1cIkNyZWF0ZSBCYWRnZVwiXG4gICAgICAgICAgICAgIGljb249e0ljb24uUGx1c31cbiAgICAgICAgICAgICAgb25BY3Rpb249eygpID0+IHB1c2goPENyZWF0ZSBvblN1Ym1pdD17cmVsb2FkfSAvPil9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvQWN0aW9uUGFuZWw+XG4gICAgICAgICl9XG4gICAgICAvPlxuICAgIDwvTGlzdD5cbiAgKVxufVxuIiwgImltcG9ydCB0eXBlIHsgQmFkZ2VBcHBsaWNhdGlvbiB9IGZyb20gJy4vc3RvcmFnZS50cydcbmltcG9ydCB7IEFjdGlvbiwgQWN0aW9uUGFuZWwsIEZvcm0sIHVzZU5hdmlnYXRpb24gfSBmcm9tICdAcmF5Y2FzdC9hcGknXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBhZGRCYWRnZSwgZ2V0QXBwcyB9IGZyb20gJy4vc3RvcmFnZS50cydcblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZShwcm9wczogeyBvblN1Ym1pdDogKCkgPT4gUHJvbWlzZTx2b2lkPiB9KSB7XG4gIGNvbnN0IHsgcG9wIH0gPSB1c2VOYXZpZ2F0aW9uKClcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IFthcHBzLCBzZXRBcHBzXSA9IHVzZVN0YXRlPEJhZGdlQXBwbGljYXRpb25bXT4oW10pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0QXBwcyhhd2FpdCBnZXRBcHBzKCkpXG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpXG4gICAgfSkoKVxuICB9LCBbXSlcblxuICByZXR1cm4gKFxuICAgIDxGb3JtXG4gICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cbiAgICAgIG5hdmlnYXRpb25UaXRsZT1cIkNyZWF0ZSBCYWRnZVwiXG4gICAgICBhY3Rpb25zPXsoXG4gICAgICAgIDxBY3Rpb25QYW5lbD5cbiAgICAgICAgICA8QWN0aW9uLlN1Ym1pdEZvcm1cbiAgICAgICAgICAgIHRpdGxlPVwiU3VibWl0XCJcbiAgICAgICAgICAgIG9uU3VibWl0PXsodmFsdWVzOiB7IGJ1bmRsZUlkOiBzdHJpbmcgfSkgPT4gYWRkQmFkZ2UodmFsdWVzLmJ1bmRsZUlkKS50aGVuKHByb3BzLm9uU3VibWl0KS50aGVuKHBvcCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9BY3Rpb25QYW5lbD5cbiAgICAgICl9XG4gICAgPlxuICAgICAgPEZvcm0uRHJvcGRvd24gaWQ9XCJidW5kbGVJZFwiIHRpdGxlPVwiQXBwbGljYXRpb25cIj5cbiAgICAgICAge2FwcHMubWFwKGFwcCA9PiAoXG4gICAgICAgICAgPEZvcm0uRHJvcGRvd24uSXRlbVxuICAgICAgICAgICAga2V5PXthcHAuYnVuZGxlSWR9XG4gICAgICAgICAgICB2YWx1ZT17YXBwLmJ1bmRsZUlkfVxuICAgICAgICAgICAgdGl0bGU9e2FwcC5uYW1lfVxuICAgICAgICAgICAgaWNvbj17eyBmaWxlSWNvbjogYXBwLnBhdGggfX1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvRm9ybS5Ecm9wZG93bj5cblxuICAgICAgPEZvcm0uRGVzY3JpcHRpb24gdGV4dD1cIkFwcGxpY2F0aW9ucyBtdXN0IGJlIG9wZW4gb3Iga2VwdCBpbiB0aGUgRG9jayB0byBjb3VudCBiYWRnZXMuIEFkZGl0aW9uYWxseSwgUmF5Y2FzdCBtdXN0IGhhdmUgQXV0b21hdGlvbiBhbmQgQWNjZXNzaWJpbGl0eSBwZXJtaXNzaW9ucyBlbmFibGVkLlwiIC8+XG4gICAgPC9Gb3JtPlxuICApXG59XG4iLCAiaW1wb3J0IHR5cGUgeyBBcHBsaWNhdGlvbiB9IGZyb20gJ0ByYXljYXN0L2FwaSdcbmltcG9ydCB7IGdldEFwcGxpY2F0aW9ucywgTG9jYWxTdG9yYWdlIH0gZnJvbSAnQHJheWNhc3QvYXBpJ1xuXG5leHBvcnQgaW50ZXJmYWNlIEJhZGdlQXBwbGljYXRpb24gZXh0ZW5kcyBBcHBsaWNhdGlvbiB7XG4gIGJ1bmRsZUlkOiBzdHJpbmdcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCYWRnZSB7XG4gIGFwcDogQmFkZ2VBcHBsaWNhdGlvblxufVxuXG5jb25zdCBsb2NhbGUgPSBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkubG9jYWxlXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBcHBzKCkge1xuICByZXR1cm4gKGF3YWl0IGdldEFwcGxpY2F0aW9ucygpKVxuICAgIC5maWx0ZXIoKGFwcCk6IGFwcCBpcyBCYWRnZUFwcGxpY2F0aW9uID0+IHR5cGVvZiBhcHAuYnVuZGxlSWQgPT09ICdzdHJpbmcnKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUsIGxvY2FsZSwgeyBzZW5zaXRpdml0eTogJ2Jhc2UnIH0pKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U3RvcmFnZSgpIHtcbiAgY29uc3QgYXBwcyA9IGF3YWl0IGdldEFwcHMoKVxuICBjb25zdCBidW5kbGVJZHMgPSBuZXcgU2V0KGFwcHMubWFwKGFwcCA9PiBhcHAuYnVuZGxlSWQpKVxuXG4gIHRyeSB7XG4gICAgcmV0dXJuIChKU09OLnBhcnNlKChhd2FpdCBMb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYmFkZ2VzJykpIHx8ICdbXScpIGFzIEJhZGdlW10pXG4gICAgICAuZmlsdGVyKGJhZGdlID0+IGJ1bmRsZUlkcy5oYXMoYmFkZ2UuYXBwLmJ1bmRsZUlkKSlcbiAgfVxuICBjYXRjaCB7XG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gc2V0U3RvcmFnZShiYWRnZXM6IEJhZGdlW10pIHtcbiAgYXdhaXQgTG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2JhZGdlcycsIEpTT04uc3RyaW5naWZ5KFxuICAgIGJhZGdlcy5zb3J0KChhLCBiKSA9PiBhLmFwcC5uYW1lLmxvY2FsZUNvbXBhcmUoYi5hcHAubmFtZSwgbG9jYWxlLCB7IHNlbnNpdGl2aXR5OiAnYmFzZScgfSkpLFxuICApKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYWRkQmFkZ2UoYnVuZGxlSWQ6IHN0cmluZykge1xuICBjb25zdCBhcHAgPSAoYXdhaXQgZ2V0QXBwcygpKS5maW5kKGFwcCA9PiBhcHAuYnVuZGxlSWQgPT09IGJ1bmRsZUlkKVxuICBjb25zdCBiYWRnZXMgPSBhd2FpdCBnZXRTdG9yYWdlKClcblxuICBpZiAoIWFwcCB8fCBiYWRnZXMuc29tZShiYWRnZSA9PiBiYWRnZS5hcHAuYnVuZGxlSWQgPT09IGJ1bmRsZUlkKSlcbiAgICByZXR1cm5cblxuICBiYWRnZXMucHVzaCh7IGFwcCB9KVxuICBhd2FpdCBzZXRTdG9yYWdlKGJhZGdlcylcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUJhZGdlKGJ1bmRsZUlkOiBzdHJpbmcpIHtcbiAgYXdhaXQgc2V0U3RvcmFnZSgoYXdhaXQgZ2V0U3RvcmFnZSgpKS5maWx0ZXIoYmFkZ2UgPT4gYmFkZ2UuYXBwLmJ1bmRsZUlkICE9PSBidW5kbGVJZCkpXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQSxJQUFBQSxjQUFvRjtBQUNwRixJQUFBQyxnQkFBb0M7OztBQ0RwQyxJQUFBQyxjQUF5RDtBQUN6RCxtQkFBb0M7OztBQ0RwQyxpQkFBOEM7QUFVOUMsSUFBTSxTQUFTLEtBQUssZUFBZSxFQUFFLGdCQUFnQixFQUFFO0FBRXZELGVBQXNCLFVBQVU7QUFDOUIsVUFBUSxVQUFNLDRCQUFnQixHQUMzQixPQUFPLENBQUMsUUFBaUMsT0FBTyxJQUFJLGFBQWEsUUFBUSxFQUN6RSxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsS0FBSyxjQUFjLEVBQUUsTUFBTSxRQUFRLEVBQUUsYUFBYSxPQUFPLENBQUMsQ0FBQztBQUNqRjtBQUVBLGVBQXNCLGFBQWE7QUFDakMsUUFBTSxPQUFPLE1BQU0sUUFBUTtBQUMzQixRQUFNLFlBQVksSUFBSSxJQUFJLEtBQUssSUFBSSxTQUFPLElBQUksUUFBUSxDQUFDO0FBRXZELE1BQUk7QUFDRixXQUFRLEtBQUssTUFBTyxNQUFNLHdCQUFhLFFBQVEsUUFBUSxLQUFNLElBQUksRUFDOUQsT0FBTyxXQUFTLFVBQVUsSUFBSSxNQUFNLElBQUksUUFBUSxDQUFDO0FBQUEsRUFDdEQsUUFDTTtBQUNKLFdBQU8sQ0FBQztBQUFBLEVBQ1Y7QUFDRjtBQUVBLGVBQWUsV0FBVyxRQUFpQjtBQUN6QyxRQUFNLHdCQUFhLFFBQVEsVUFBVSxLQUFLO0FBQUEsSUFDeEMsT0FBTyxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsSUFBSSxLQUFLLGNBQWMsRUFBRSxJQUFJLE1BQU0sUUFBUSxFQUFF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QSxVQUNBLDZDQUFDLHdCQUFZLFNBQVosRUFDQztBQUFBLFlBQUM7QUFBQTtBQUFBLGNBQ0MsT0FBTTtBQUFBLGNBQ04sTUFBTSxpQkFBSztBQUFBLGNBQ1gsT0FBTyxtQkFBTyxNQUFNO0FBQUEsY0FDcEIsVUFBVSxFQUFFLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxJQUFJO0FBQUEsY0FDMUMsVUFBVSxVQUFNLDBCQUFhO0FBQUEsZ0JBQzNCLE9BQU8sTUFBTSxJQUFJO0FBQUEsZ0JBQ2pCLFNBQVM7QUFBQSxnQkFDVCxlQUFlO0FBQUEsa0JBQ2IsT0FBTztBQUFBLGtCQUNQLE9BQU8sa0JBQU0sWUFBWTtBQUFBLGtCQUN6QixVQUFVLFlBQVk7QUFDcEIsMEJBQU0sWUFBWSxNQUFNLElBQUksUUFBUTtBQUNwQywwQkFBTSxPQUFPO0FBQUEsa0JBQ2Y7QUFBQSxnQkFDRjtBQUFBLGNBQ0YsQ0FBQztBQUFBO0FBQUEsVUFDSCxHQUNGO0FBQUEsV0FDRjtBQUFBO0FBQUEsTUEvQkcsTUFBTSxJQUFJO0FBQUEsSUFpQ2pCLENBQ0Q7QUFBQSxJQUVEO0FBQUEsTUFBQyxpQkFBSztBQUFBLE1BQUw7QUFBQSxRQUNDLE1BQU0saUJBQUs7QUFBQSxRQUNYLFNBQ0UsNkNBQUMsMkJBQ0M7QUFBQSxVQUFDO0FBQUE7QUFBQSxZQUNDLE9BQU07QUFBQSxZQUNOLE1BQU0saUJBQUs7QUFBQSxZQUNYLFVBQVUsTUFBTSxLQUFLLDZDQUFDLFVBQU8sVUFBVSxRQUFRLENBQUU7QUFBQTtBQUFBLFFBQ25ELEdBQ0Y7QUFBQTtBQUFBLElBRUo7QUFBQSxLQUNGO0FBRUo7IiwKICAibmFtZXMiOiBbImltcG9ydF9hcGkiLCAiaW1wb3J0X3JlYWN0IiwgImltcG9ydF9hcGkiLCAiYXBwIiwgImltcG9ydF9qc3hfcnVudGltZSJdCn0K
