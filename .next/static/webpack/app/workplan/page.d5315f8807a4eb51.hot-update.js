"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/workplan/page",{

/***/ "(app-pages-browser)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   dbService: function() { return /* binding */ dbService; }\n/* harmony export */ });\nlet dbData = null;\nasync function readDb() {\n    if (!dbData) {\n        const response = await fetch(\"/api/db\");\n        if (!response.ok) {\n            throw new Error(\"Failed to fetch database\");\n        }\n        dbData = await response.json();\n    }\n    return dbData;\n}\nasync function writeDb(data) {\n    const response = await fetch(\"/api/db\", {\n        method: \"PUT\",\n        headers: {\n            \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify(data)\n    });\n    if (!response.ok) {\n        throw new Error(\"Failed to write to database\");\n    }\n    dbData = data;\n}\nconst dbService = {\n    // Store operations\n    getAllStores: async ()=>{\n        const db = await readDb();\n        return db.stores;\n    },\n    getStore: async (id)=>{\n        const db = await readDb();\n        return db.stores.find((store)=>store.id === id);\n    },\n    addStore: async (store)=>{\n        const db = await readDb();\n        // Generate new ID\n        const newId = db.stores.length > 0 ? Math.max(...db.stores.map((s)=>s.id)) + 1 : 1;\n        const newStore = {\n            id: newId,\n            ...store\n        };\n        db.stores.push(newStore);\n        await writeDb(db);\n        return newId;\n    },\n    updateStore: async (id, store)=>{\n        const db = await readDb();\n        const index = db.stores.findIndex((store)=>store.id === id);\n        if (index === -1) {\n            throw new Error(\"Store not found\");\n        }\n        db.stores[index] = {\n            ...db.stores[index],\n            ...store\n        };\n        await writeDb(db);\n    },\n    deleteStore: async (id)=>{\n        const db = await readDb();\n        const index = db.stores.findIndex((store)=>store.id === id);\n        if (index === -1) {\n            throw new Error(\"Store not found\");\n        }\n        db.stores.splice(index, 1);\n        await writeDb(db);\n    },\n    // Employee operations\n    getAllEmployees: async ()=>{\n        const db = await readDb();\n        return db.employees;\n    },\n    getEmployee: async (id)=>{\n        const db = await readDb();\n        return db.employees.find((employee)=>employee.id === id);\n    },\n    addEmployee: async (employee)=>{\n        const db = await readDb();\n        // Generate new ID\n        const newId = db.employees.length > 0 ? Math.max(...db.employees.map((e)=>e.id)) + 1 : 1;\n        const newEmployee = {\n            id: newId,\n            ...employee\n        };\n        db.employees.push(newEmployee);\n        await writeDb(db);\n        return newId;\n    },\n    updateEmployee: async (id, employee)=>{\n        const db = await readDb();\n        const index = db.employees.findIndex((employee)=>employee.id === id);\n        if (index === -1) {\n            throw new Error(\"Employee not found\");\n        }\n        db.employees[index] = {\n            ...db.employees[index],\n            ...employee\n        };\n        await writeDb(db);\n    },\n    deleteEmployee: async (id)=>{\n        const db = await readDb();\n        const index = db.employees.findIndex((employee)=>employee.id === id);\n        if (index === -1) {\n            throw new Error(\"Employee not found\");\n        }\n        db.employees.splice(index, 1);\n        await writeDb(db);\n    },\n    // Log operations\n    getLogEntries: async ()=>{\n        const db = await readDb();\n        return db.logs || [];\n    },\n    addLogEntry: async (action, details)=>{\n        const db = await readDb();\n        if (!db.logs) {\n            db.logs = [];\n        }\n        const newLog = {\n            id: Math.max(0, ...db.logs.map((log)=>log.id)) + 1,\n            action,\n            details,\n            timestamp: new Date().toISOString()\n        };\n        db.logs.push(newLog);\n        await writeDb(db);\n    },\n    // Shift operations\n    getShiftsByStore: async (storeId)=>{\n        console.log(\"Getting shifts for store:\", storeId);\n        const db = await readDb();\n        const shifts = db.shifts.filter((shift)=>shift.storeId === storeId);\n        console.log(\"Found shifts:\", shifts);\n        return shifts;\n    },\n    addShift: async (shiftData)=>{\n        console.log(\"Adding shift:\", shiftData);\n        const db = await readDb();\n        // Generate new ID\n        const newId = db.shifts.length > 0 ? Math.max(...db.shifts.map((s)=>s.id)) + 1 : 1;\n        const newShift = {\n            id: newId,\n            ...shiftData\n        };\n        console.log(\"Created new shift:\", newShift);\n        db.shifts.push(newShift);\n        await writeDb(db);\n        // Add log entry\n        await dbService.addLogEntry(\"Schicht erstellt\", \"Neue Schicht f\\xfcr \".concat(shiftData.employeeId, \" am \").concat(shiftData.date));\n        return newId;\n    },\n    updateShift: async (id, shiftData)=>{\n        const db = await readDb();\n        const index = db.shifts.findIndex((shift)=>shift.id === id);\n        if (index === -1) {\n            throw new Error(\"Shift not found\");\n        }\n        const oldShift = db.shifts[index];\n        const updatedShift = {\n            ...oldShift,\n            ...shiftData\n        };\n        db.shifts[index] = updatedShift;\n        await writeDb(db);\n        // Add log entry\n        await dbService.addLogEntry(\"Schicht aktualisiert\", \"Schicht \".concat(id, \" wurde aktualisiert\"));\n    },\n    deleteShift: async (id)=>{\n        const db = await readDb();\n        const index = db.shifts.findIndex((shift)=>shift.id === id);\n        if (index === -1) {\n            throw new Error(\"Shift not found\");\n        }\n        db.shifts.splice(index, 1);\n        await writeDb(db);\n        // Add log entry\n        await dbService.addLogEntry(\"Schicht gel\\xf6scht\", \"Schicht \".concat(id, \" wurde gel\\xf6scht\"));\n    }\n};\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aUMsV0FBVyxDQUN6QixvQkFDQSx1QkFBK0NlLE9BQTNCQSxVQUFVRSxVQUFVLEVBQUMsUUFBcUIsT0FBZkYsVUFBVUcsSUFBSTtRQUcvRCxPQUFPMUM7SUFDVDtJQUVBMkMsYUFBYSxPQUFPL0MsSUFBWTJDO1FBQzlCLE1BQU05QyxLQUFLLE1BQU1mO1FBQ2pCLE1BQU0rQixRQUFRaEIsR0FBRzBDLE1BQU0sQ0FBQ3pCLFNBQVMsQ0FBQzJCLENBQUFBLFFBQVNBLE1BQU16QyxFQUFFLEtBQUtBO1FBRXhELElBQUlhLFVBQVUsQ0FBQyxHQUFHO1lBQ2hCLE1BQU0sSUFBSTNCLE1BQU07UUFDbEI7UUFFQSxNQUFNOEQsV0FBV25ELEdBQUcwQyxNQUFNLENBQUMxQixNQUFNO1FBQ2pDLE1BQU1vQyxlQUFlO1lBQUUsR0FBR0QsUUFBUTtZQUFFLEdBQUdMLFNBQVM7UUFBQztRQUNqRDlDLEdBQUcwQyxNQUFNLENBQUMxQixNQUFNLEdBQUdvQztRQUNuQixNQUFNN0QsUUFBUVM7UUFFZCxnQkFBZ0I7UUFDaEIsTUFBTUYsVUFBVWlDLFdBQVcsQ0FDekIsd0JBQ0EsV0FBYyxPQUFINUIsSUFBRztJQUVsQjtJQUVBa0QsYUFBYSxPQUFPbEQ7UUFDbEIsTUFBTUgsS0FBSyxNQUFNZjtRQUNqQixNQUFNK0IsUUFBUWhCLEdBQUcwQyxNQUFNLENBQUN6QixTQUFTLENBQUMyQixDQUFBQSxRQUFTQSxNQUFNekMsRUFBRSxLQUFLQTtRQUV4RCxJQUFJYSxVQUFVLENBQUMsR0FBRztZQUNoQixNQUFNLElBQUkzQixNQUFNO1FBQ2xCO1FBRUFXLEdBQUcwQyxNQUFNLENBQUN2QixNQUFNLENBQUNILE9BQU87UUFDeEIsTUFBTXpCLFFBQVFTO1FBRWQsZ0JBQWdCO1FBQ2hCLE1BQU1GLFVBQVVpQyxXQUFXLENBQ3pCLHVCQUNBLFdBQWMsT0FBSDVCLElBQUc7SUFFbEI7QUFDRixFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9saWIvZGIudHM/OWU0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbXBsb3llZSB9IGZyb20gJ0AvdHlwZXMvZW1wbG95ZWUnO1xuaW1wb3J0IHsgU3RvcmUgfSBmcm9tICdAL3R5cGVzL3N0b3JlJztcbmltcG9ydCB7IFNoaWZ0IH0gZnJvbSAnQC90eXBlcy9zaGlmdCc7XG5pbXBvcnQgeyBMb2dFbnRyeSB9IGZyb20gJ0AvdHlwZXMvbG9nJztcblxubGV0IGRiRGF0YToge1xuICBlbXBsb3llZXM6IEVtcGxveWVlW107XG4gIHN0b3JlczogU3RvcmVbXTtcbiAgc2hpZnRzOiBTaGlmdFtdO1xuICBsb2dzOiBMb2dFbnRyeVtdO1xufSB8IG51bGwgPSBudWxsO1xuXG5hc3luYyBmdW5jdGlvbiByZWFkRGIoKSB7XG4gIGlmICghZGJEYXRhKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9kYicpO1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIGRhdGFiYXNlJyk7XG4gICAgfVxuICAgIGRiRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgfVxuICByZXR1cm4gZGJEYXRhITtcbn1cblxuYXN5bmMgZnVuY3Rpb24gd3JpdGVEYihkYXRhOiB0eXBlb2YgZGJEYXRhKSB7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hcGkvZGInLCB7XG4gICAgbWV0aG9kOiAnUFVUJyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gIH0pO1xuXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byB3cml0ZSB0byBkYXRhYmFzZScpO1xuICB9XG5cbiAgZGJEYXRhID0gZGF0YTtcbn1cblxuZXhwb3J0IGNvbnN0IGRiU2VydmljZSA9IHtcbiAgLy8gU3RvcmUgb3BlcmF0aW9uc1xuICBnZXRBbGxTdG9yZXM6IGFzeW5jICgpOiBQcm9taXNlPFN0b3JlW10+ID0+IHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IHJlYWREYigpO1xuICAgIHJldHVybiBkYi5zdG9yZXM7XG4gIH0sXG5cbiAgZ2V0U3RvcmU6IGFzeW5jIChpZDogbnVtYmVyKTogUHJvbWlzZTxTdG9yZSB8IHVuZGVmaW5lZD4gPT4ge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgcmVhZERiKCk7XG4gICAgcmV0dXJuIGRiLnN0b3Jlcy5maW5kKHN0b3JlID0+IHN0b3JlLmlkID09PSBpZCk7XG4gIH0sXG5cbiAgYWRkU3RvcmU6IGFzeW5jIChzdG9yZTogT21pdDxTdG9yZSwgJ2lkJz4pOiBQcm9taXNlPG51bWJlcj4gPT4ge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgcmVhZERiKCk7XG4gICAgXG4gICAgLy8gR2VuZXJhdGUgbmV3IElEXG4gICAgY29uc3QgbmV3SWQgPSBkYi5zdG9yZXMubGVuZ3RoID4gMCA/IE1hdGgubWF4KC4uLmRiLnN0b3Jlcy5tYXAocyA9PiBzLmlkKSkgKyAxIDogMTtcbiAgICBcbiAgICBjb25zdCBuZXdTdG9yZTogU3RvcmUgPSB7XG4gICAgICBpZDogbmV3SWQsXG4gICAgICAuLi5zdG9yZVxuICAgIH07XG5cbiAgICBkYi5zdG9yZXMucHVzaChuZXdTdG9yZSk7XG4gICAgYXdhaXQgd3JpdGVEYihkYik7XG4gICAgXG4gICAgcmV0dXJuIG5ld0lkO1xuICB9LFxuXG4gIHVwZGF0ZVN0b3JlOiBhc3luYyAoaWQ6IG51bWJlciwgc3RvcmU6IFBhcnRpYWw8U3RvcmU+KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCByZWFkRGIoKTtcbiAgICBjb25zdCBpbmRleCA9IGRiLnN0b3Jlcy5maW5kSW5kZXgoc3RvcmUgPT4gc3RvcmUuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0b3JlIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICBcbiAgICBkYi5zdG9yZXNbaW5kZXhdID0ge1xuICAgICAgLi4uZGIuc3RvcmVzW2luZGV4XSxcbiAgICAgIC4uLnN0b3JlXG4gICAgfTtcbiAgICBcbiAgICBhd2FpdCB3cml0ZURiKGRiKTtcbiAgfSxcblxuICBkZWxldGVTdG9yZTogYXN5bmMgKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IHJlYWREYigpO1xuICAgIGNvbnN0IGluZGV4ID0gZGIuc3RvcmVzLmZpbmRJbmRleChzdG9yZSA9PiBzdG9yZS5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU3RvcmUgbm90IGZvdW5kJyk7XG4gICAgfVxuICAgIFxuICAgIGRiLnN0b3Jlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGF3YWl0IHdyaXRlRGIoZGIpO1xuICB9LFxuXG4gIC8vIEVtcGxveWVlIG9wZXJhdGlvbnNcbiAgZ2V0QWxsRW1wbG95ZWVzOiBhc3luYyAoKTogUHJvbWlzZTxFbXBsb3llZVtdPiA9PiB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCByZWFkRGIoKTtcbiAgICByZXR1cm4gZGIuZW1wbG95ZWVzO1xuICB9LFxuXG4gIGdldEVtcGxveWVlOiBhc3luYyAoaWQ6IG51bWJlcik6IFByb21pc2U8RW1wbG95ZWUgfCB1bmRlZmluZWQ+ID0+IHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IHJlYWREYigpO1xuICAgIHJldHVybiBkYi5lbXBsb3llZXMuZmluZChlbXBsb3llZSA9PiBlbXBsb3llZS5pZCA9PT0gaWQpO1xuICB9LFxuXG4gIGFkZEVtcGxveWVlOiBhc3luYyAoZW1wbG95ZWU6IE9taXQ8RW1wbG95ZWUsICdpZCc+KTogUHJvbWlzZTxudW1iZXI+ID0+IHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IHJlYWREYigpO1xuICAgIFxuICAgIC8vIEdlbmVyYXRlIG5ldyBJRFxuICAgIGNvbnN0IG5ld0lkID0gZGIuZW1wbG95ZWVzLmxlbmd0aCA+IDAgPyBNYXRoLm1heCguLi5kYi5lbXBsb3llZXMubWFwKGUgPT4gZS5pZCkpICsgMSA6IDE7XG4gICAgXG4gICAgY29uc3QgbmV3RW1wbG95ZWU6IEVtcGxveWVlID0ge1xuICAgICAgaWQ6IG5ld0lkLFxuICAgICAgLi4uZW1wbG95ZWVcbiAgICB9O1xuXG4gICAgZGIuZW1wbG95ZWVzLnB1c2gobmV3RW1wbG95ZWUpO1xuICAgIGF3YWl0IHdyaXRlRGIoZGIpO1xuICAgIFxuICAgIHJldHVybiBuZXdJZDtcbiAgfSxcblxuICB1cGRhdGVFbXBsb3llZTogYXN5bmMgKGlkOiBudW1iZXIsIGVtcGxveWVlOiBQYXJ0aWFsPEVtcGxveWVlPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgcmVhZERiKCk7XG4gICAgY29uc3QgaW5kZXggPSBkYi5lbXBsb3llZXMuZmluZEluZGV4KGVtcGxveWVlID0+IGVtcGxveWVlLmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbXBsb3llZSBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgZGIuZW1wbG95ZWVzW2luZGV4XSA9IHtcbiAgICAgIC4uLmRiLmVtcGxveWVlc1tpbmRleF0sXG4gICAgICAuLi5lbXBsb3llZVxuICAgIH07XG4gICAgXG4gICAgYXdhaXQgd3JpdGVEYihkYik7XG4gIH0sXG5cbiAgZGVsZXRlRW1wbG95ZWU6IGFzeW5jIChpZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCByZWFkRGIoKTtcbiAgICBjb25zdCBpbmRleCA9IGRiLmVtcGxveWVlcy5maW5kSW5kZXgoZW1wbG95ZWUgPT4gZW1wbG95ZWUuaWQgPT09IGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtcGxveWVlIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICBcbiAgICBkYi5lbXBsb3llZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICBhd2FpdCB3cml0ZURiKGRiKTtcbiAgfSxcblxuICAvLyBMb2cgb3BlcmF0aW9uc1xuICBnZXRMb2dFbnRyaWVzOiBhc3luYyAoKTogUHJvbWlzZTxMb2dFbnRyeVtdPiA9PiB7XG4gICAgY29uc3QgZGIgPSBhd2FpdCByZWFkRGIoKTtcbiAgICByZXR1cm4gZGIubG9ncyB8fCBbXTtcbiAgfSxcblxuICBhZGRMb2dFbnRyeTogYXN5bmMgKGFjdGlvbjogc3RyaW5nLCBkZXRhaWxzOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IHJlYWREYigpO1xuICAgIGlmICghZGIubG9ncykge1xuICAgICAgZGIubG9ncyA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld0xvZzogTG9nRW50cnkgPSB7XG4gICAgICBpZDogTWF0aC5tYXgoMCwgLi4uZGIubG9ncy5tYXAobG9nID0+IGxvZy5pZCkpICsgMSxcbiAgICAgIGFjdGlvbixcbiAgICAgIGRldGFpbHMsXG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICB9O1xuXG4gICAgZGIubG9ncy5wdXNoKG5ld0xvZyk7XG4gICAgYXdhaXQgd3JpdGVEYihkYik7XG4gIH0sXG5cbiAgLy8gU2hpZnQgb3BlcmF0aW9uc1xuICBnZXRTaGlmdHNCeVN0b3JlOiBhc3luYyAoc3RvcmVJZDogbnVtYmVyKTogUHJvbWlzZTxTaGlmdFtdPiA9PiB7XG4gICAgY29uc29sZS5sb2coJ0dldHRpbmcgc2hpZnRzIGZvciBzdG9yZTonLCBzdG9yZUlkKTtcbiAgICBjb25zdCBkYiA9IGF3YWl0IHJlYWREYigpO1xuICAgIGNvbnN0IHNoaWZ0cyA9IGRiLnNoaWZ0cy5maWx0ZXIoc2hpZnQgPT4gc2hpZnQuc3RvcmVJZCA9PT0gc3RvcmVJZCk7XG4gICAgY29uc29sZS5sb2coJ0ZvdW5kIHNoaWZ0czonLCBzaGlmdHMpO1xuICAgIHJldHVybiBzaGlmdHM7XG4gIH0sXG5cbiAgYWRkU2hpZnQ6IGFzeW5jIChzaGlmdERhdGE6IE9taXQ8U2hpZnQsICdpZCc+KTogUHJvbWlzZTxudW1iZXI+ID0+IHtcbiAgICBjb25zb2xlLmxvZygnQWRkaW5nIHNoaWZ0OicsIHNoaWZ0RGF0YSk7XG4gICAgY29uc3QgZGIgPSBhd2FpdCByZWFkRGIoKTtcbiAgICBcbiAgICAvLyBHZW5lcmF0ZSBuZXcgSURcbiAgICBjb25zdCBuZXdJZCA9IGRiLnNoaWZ0cy5sZW5ndGggPiAwID8gTWF0aC5tYXgoLi4uZGIuc2hpZnRzLm1hcChzID0+IHMuaWQpKSArIDEgOiAxO1xuICAgIFxuICAgIGNvbnN0IG5ld1NoaWZ0OiBTaGlmdCA9IHtcbiAgICAgIGlkOiBuZXdJZCxcbiAgICAgIC4uLnNoaWZ0RGF0YVxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZygnQ3JlYXRlZCBuZXcgc2hpZnQ6JywgbmV3U2hpZnQpO1xuICAgIFxuICAgIGRiLnNoaWZ0cy5wdXNoKG5ld1NoaWZ0KTtcbiAgICBhd2FpdCB3cml0ZURiKGRiKTtcbiAgICBcbiAgICAvLyBBZGQgbG9nIGVudHJ5XG4gICAgYXdhaXQgZGJTZXJ2aWNlLmFkZExvZ0VudHJ5KFxuICAgICAgJ1NjaGljaHQgZXJzdGVsbHQnLFxuICAgICAgYE5ldWUgU2NoaWNodCBmw7xyICR7c2hpZnREYXRhLmVtcGxveWVlSWR9IGFtICR7c2hpZnREYXRhLmRhdGV9YFxuICAgICk7XG4gICAgXG4gICAgcmV0dXJuIG5ld0lkO1xuICB9LFxuXG4gIHVwZGF0ZVNoaWZ0OiBhc3luYyAoaWQ6IG51bWJlciwgc2hpZnREYXRhOiBQYXJ0aWFsPFNoaWZ0Pik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGNvbnN0IGRiID0gYXdhaXQgcmVhZERiKCk7XG4gICAgY29uc3QgaW5kZXggPSBkYi5zaGlmdHMuZmluZEluZGV4KHNoaWZ0ID0+IHNoaWZ0LmlkID09PSBpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlmdCBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3Qgb2xkU2hpZnQgPSBkYi5zaGlmdHNbaW5kZXhdO1xuICAgIGNvbnN0IHVwZGF0ZWRTaGlmdCA9IHsgLi4ub2xkU2hpZnQsIC4uLnNoaWZ0RGF0YSB9O1xuICAgIGRiLnNoaWZ0c1tpbmRleF0gPSB1cGRhdGVkU2hpZnQ7XG4gICAgYXdhaXQgd3JpdGVEYihkYik7XG4gICAgXG4gICAgLy8gQWRkIGxvZyBlbnRyeVxuICAgIGF3YWl0IGRiU2VydmljZS5hZGRMb2dFbnRyeShcbiAgICAgICdTY2hpY2h0IGFrdHVhbGlzaWVydCcsXG4gICAgICBgU2NoaWNodCAke2lkfSB3dXJkZSBha3R1YWxpc2llcnRgXG4gICAgKTtcbiAgfSxcblxuICBkZWxldGVTaGlmdDogYXN5bmMgKGlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBjb25zdCBkYiA9IGF3YWl0IHJlYWREYigpO1xuICAgIGNvbnN0IGluZGV4ID0gZGIuc2hpZnRzLmZpbmRJbmRleChzaGlmdCA9PiBzaGlmdC5pZCA9PT0gaWQpO1xuICAgIFxuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2hpZnQgbm90IGZvdW5kJyk7XG4gICAgfVxuICAgIFxuICAgIGRiLnNoaWZ0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIGF3YWl0IHdyaXRlRGIoZGIpO1xuICAgIFxuICAgIC8vIEFkZCBsb2cgZW50cnlcbiAgICBhd2FpdCBkYlNlcnZpY2UuYWRkTG9nRW50cnkoXG4gICAgICAnU2NoaWNodCBnZWzDtnNjaHQnLFxuICAgICAgYFNjaGljaHQgJHtpZH0gd3VyZGUgZ2Vsw7ZzY2h0YFxuICAgICk7XG4gIH1cbn07XG4iXSwibmFtZXMiOlsiZGJEYXRhIiwicmVhZERiIiwicmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwiRXJyb3IiLCJqc29uIiwid3JpdGVEYiIsImRhdGEiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJkYlNlcnZpY2UiLCJnZXRBbGxTdG9yZXMiLCJkYiIsInN0b3JlcyIsImdldFN0b3JlIiwiaWQiLCJmaW5kIiwic3RvcmUiLCJhZGRTdG9yZSIsIm5ld0lkIiwibGVuZ3RoIiwiTWF0aCIsIm1heCIsIm1hcCIsInMiLCJuZXdTdG9yZSIsInB1c2giLCJ1cGRhdGVTdG9yZSIsImluZGV4IiwiZmluZEluZGV4IiwiZGVsZXRlU3RvcmUiLCJzcGxpY2UiLCJnZXRBbGxFbXBsb3llZXMiLCJlbXBsb3llZXMiLCJnZXRFbXBsb3llZSIsImVtcGxveWVlIiwiYWRkRW1wbG95ZWUiLCJlIiwibmV3RW1wbG95ZWUiLCJ1cGRhdGVFbXBsb3llZSIsImRlbGV0ZUVtcGxveWVlIiwiZ2V0TG9nRW50cmllcyIsImxvZ3MiLCJhZGRMb2dFbnRyeSIsImFjdGlvbiIsImRldGFpbHMiLCJuZXdMb2ciLCJsb2ciLCJ0aW1lc3RhbXAiLCJEYXRlIiwidG9JU09TdHJpbmciLCJnZXRTaGlmdHNCeVN0b3JlIiwic3RvcmVJZCIsImNvbnNvbGUiLCJzaGlmdHMiLCJmaWx0ZXIiLCJzaGlmdCIsImFkZFNoaWZ0Iiwic2hpZnREYXRhIiwibmV3U2hpZnQiLCJlbXBsb3llZUlkIiwiZGF0ZSIsInVwZGF0ZVNoaWZ0Iiwib2xkU2hpZnQiLCJ1cGRhdGVkU2hpZnQiLCJkZWxldGVTaGlmdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/lib/db.ts\n"));

/***/ })

});