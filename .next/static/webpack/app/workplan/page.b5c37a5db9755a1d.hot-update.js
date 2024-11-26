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

/***/ "(app-pages-browser)/./src/app/workplan/EventContent.tsx":
/*!*******************************************!*\
  !*** ./src/app/workplan/EventContent.tsx ***!
  \*******************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _barrel_optimize_names_FaCheck_FaEdit_FaTimes_FaTrash_react_icons_fa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! __barrel_optimize__?names=FaCheck,FaEdit,FaTimes,FaTrash!=!react-icons/fa */ \"(app-pages-browser)/./node_modules/react-icons/fa/index.mjs\");\n\nvar _s = $RefreshSig$();\n\n\nconst EventContent = (param)=>{\n    let { employee, workingShift, shift, onDelete, onEdit, showAlert, refreshShifts, availableShifts } = param;\n    _s();\n    const [isEditing, setIsEditing] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [selectedShiftId, setSelectedShiftId] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(shift.shiftId);\n    const handleDelete = async (e)=>{\n        e.stopPropagation(); // Prevent event click from triggering\n        if (confirm(\"M\\xf6chten Sie die Schicht von \".concat((employee === null || employee === void 0 ? void 0 : employee.name) || \"Unbekannt\", \" wirklich l\\xf6schen?\"))) {\n            try {\n                await onDelete(shift.id);\n                showAlert(\"Schicht von \".concat((employee === null || employee === void 0 ? void 0 : employee.name) || \"Unbekannt\", \" wurde gel\\xf6scht\"), \"info\");\n                await refreshShifts();\n            } catch (error) {\n                console.error(\"Error deleting shift:\", error);\n                showAlert(\"Fehler beim L\\xf6schen der Schicht\", \"error\");\n            }\n        }\n    };\n    const handleEditClick = (e)=>{\n        e.stopPropagation();\n        setIsEditing(true);\n    };\n    const handleCancelEdit = (e)=>{\n        e.stopPropagation();\n        setIsEditing(false);\n        setSelectedShiftId(shift.shiftId);\n    };\n    const handleSaveEdit = async (e)=>{\n        e.stopPropagation();\n        // Parse the date and times\n        const [year, month, day] = shift.date.split(\"-\").map(Number);\n        const shiftDate = new Date(year, month - 1, day);\n        const newWorkingShift = availableShifts.find((ws)=>ws.id === selectedShiftId);\n        if (!newWorkingShift) {\n            showAlert(\"Fehler: Schicht nicht gefunden\", \"error\");\n            return;\n        }\n        const [startHour, startMinute] = newWorkingShift.fromTime.split(\":\").map(Number);\n        const [endHour, endMinute] = newWorkingShift.toTime.split(\":\").map(Number);\n        const start = new Date(shiftDate);\n        start.setHours(startHour, startMinute, 0);\n        const end = new Date(shiftDate);\n        end.setHours(endHour, endMinute, 0);\n        // For night shifts where end time is before start time, add a day to end time\n        if (end < start) {\n            end.setDate(end.getDate() + 1);\n        }\n        // First set editing to false to hide the dropdown\n        setIsEditing(false);\n        // Then update the shift\n        onEdit({\n            id: shift.id,\n            start,\n            end,\n            employeeId: shift.employeeId,\n            shiftId: selectedShiftId,\n            extendedProps: {\n                shift: {\n                    ...shift,\n                    shiftId: selectedShiftId,\n                    startTime: newWorkingShift.fromTime,\n                    endTime: newWorkingShift.toTime\n                },\n                employee,\n                workingShift: newWorkingShift\n            }\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative group\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"text-xs\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"strong\", {\n                        children: (employee === null || employee === void 0 ? void 0 : employee.name) || \"Unknown Employee\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                        lineNumber: 107,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"br\", {}, void 0, false, {\n                        fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                        lineNumber: 108,\n                        columnNumber: 9\n                    }, undefined),\n                    isEditing ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"select\", {\n                        value: selectedShiftId,\n                        onChange: (e)=>setSelectedShiftId(e.target.value),\n                        className: \"w-full p-0.5 text-xs border rounded\",\n                        onClick: (e)=>e.stopPropagation(),\n                        children: availableShifts.map((ws)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"option\", {\n                                value: ws.id,\n                                children: ws.title\n                            }, ws.id, false, {\n                                fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                                lineNumber: 117,\n                                columnNumber: 15\n                            }, undefined))\n                    }, void 0, false, {\n                        fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                        lineNumber: 110,\n                        columnNumber: 11\n                    }, undefined) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                        children: (workingShift === null || workingShift === void 0 ? void 0 : workingShift.title) || \"Unknown Shift\"\n                    }, void 0, false, {\n                        fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                        lineNumber: 123,\n                        columnNumber: 11\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                lineNumber: 106,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200\",\n                children: isEditing ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: handleSaveEdit,\n                            className: \"p-1 text-green-500 hover:text-green-700\",\n                            title: \"\\xc4nderungen speichern\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_FaCheck_FaEdit_FaTimes_FaTrash_react_icons_fa__WEBPACK_IMPORTED_MODULE_2__.FaCheck, {\n                                size: 12\n                            }, void 0, false, {\n                                fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                                lineNumber: 134,\n                                columnNumber: 15\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                            lineNumber: 129,\n                            columnNumber: 13\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: handleCancelEdit,\n                            className: \"p-1 text-gray-500 hover:text-gray-700\",\n                            title: \"Abbrechen\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_FaCheck_FaEdit_FaTimes_FaTrash_react_icons_fa__WEBPACK_IMPORTED_MODULE_2__.FaTimes, {\n                                size: 12\n                            }, void 0, false, {\n                                fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                                lineNumber: 141,\n                                columnNumber: 15\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                            lineNumber: 136,\n                            columnNumber: 13\n                        }, undefined)\n                    ]\n                }, void 0, true) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: handleEditClick,\n                            className: \"p-1 text-blue-500 hover:text-blue-700\",\n                            title: \"Schicht bearbeiten\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_FaCheck_FaEdit_FaTimes_FaTrash_react_icons_fa__WEBPACK_IMPORTED_MODULE_2__.FaEdit, {\n                                size: 12\n                            }, void 0, false, {\n                                fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                                lineNumber: 151,\n                                columnNumber: 15\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                            lineNumber: 146,\n                            columnNumber: 13\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                            onClick: handleDelete,\n                            className: \"p-1 text-red-500 hover:text-red-700\",\n                            title: \"Schicht l\\xf6schen\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_barrel_optimize_names_FaCheck_FaEdit_FaTimes_FaTrash_react_icons_fa__WEBPACK_IMPORTED_MODULE_2__.FaTrash, {\n                                size: 12\n                            }, void 0, false, {\n                                fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                                lineNumber: 158,\n                                columnNumber: 15\n                            }, undefined)\n                        }, void 0, false, {\n                            fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                            lineNumber: 153,\n                            columnNumber: 13\n                        }, undefined)\n                    ]\n                }, void 0, true)\n            }, void 0, false, {\n                fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n                lineNumber: 126,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"D:\\\\___SYSTEM\\\\Desktop\\\\_NPM\\\\arbeitsplan\\\\src\\\\app\\\\workplan\\\\EventContent.tsx\",\n        lineNumber: 105,\n        columnNumber: 5\n    }, undefined);\n};\n_s(EventContent, \"h9d43XB7MUG0yQXtI4TdbT0GM7U=\");\n_c = EventContent;\n/* harmony default export */ __webpack_exports__[\"default\"] = (EventContent);\nvar _c;\n$RefreshReg$(_c, \"EventContent\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvd29ya3BsYW4vRXZlbnRDb250ZW50LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQXdDO0FBQzJCO0FBYW5FLE1BQU1NLGVBQTRDO1FBQUMsRUFDakRDLFFBQVEsRUFDUkMsWUFBWSxFQUNaQyxLQUFLLEVBQ0xDLFFBQVEsRUFDUkMsTUFBTSxFQUNOQyxTQUFTLEVBQ1RDLGFBQWEsRUFDYkMsZUFBZSxFQUNoQjs7SUFDQyxNQUFNLENBQUNDLFdBQVdDLGFBQWEsR0FBR2YsK0NBQVFBLENBQUM7SUFDM0MsTUFBTSxDQUFDZ0IsaUJBQWlCQyxtQkFBbUIsR0FBR2pCLCtDQUFRQSxDQUFDUSxNQUFNVSxPQUFPO0lBRXBFLE1BQU1DLGVBQWUsT0FBT0M7UUFDMUJBLEVBQUVDLGVBQWUsSUFBSSxzQ0FBc0M7UUFFM0QsSUFBSUMsUUFBUSxrQ0FBNkQsT0FBOUJoQixDQUFBQSxxQkFBQUEsK0JBQUFBLFNBQVVpQixJQUFJLEtBQUksYUFBWSwyQkFBc0I7WUFDN0YsSUFBSTtnQkFDRixNQUFNZCxTQUFTRCxNQUFNZ0IsRUFBRTtnQkFDdkJiLFVBQVUsZUFBNkMsT0FBOUJMLENBQUFBLHFCQUFBQSwrQkFBQUEsU0FBVWlCLElBQUksS0FBSSxhQUFZLHVCQUFrQjtnQkFDekUsTUFBTVg7WUFDUixFQUFFLE9BQU9hLE9BQU87Z0JBQ2RDLFFBQVFELEtBQUssQ0FBQyx5QkFBeUJBO2dCQUN2Q2QsVUFBVSxzQ0FBbUM7WUFDL0M7UUFDRjtJQUNGO0lBRUEsTUFBTWdCLGtCQUFrQixDQUFDUDtRQUN2QkEsRUFBRUMsZUFBZTtRQUNqQk4sYUFBYTtJQUNmO0lBRUEsTUFBTWEsbUJBQW1CLENBQUNSO1FBQ3hCQSxFQUFFQyxlQUFlO1FBQ2pCTixhQUFhO1FBQ2JFLG1CQUFtQlQsTUFBTVUsT0FBTztJQUNsQztJQUVBLE1BQU1XLGlCQUFpQixPQUFPVDtRQUM1QkEsRUFBRUMsZUFBZTtRQUVqQiwyQkFBMkI7UUFDM0IsTUFBTSxD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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPN0I7R0F0Sk1qRTtLQUFBQTtBQXdKTiwrREFBZUEsWUFBWUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9zcmMvYXBwL3dvcmtwbGFuL0V2ZW50Q29udGVudC50c3g/NWI2NyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBGYVRyYXNoLCBGYUVkaXQsIEZhQ2hlY2ssIEZhVGltZXMgfSBmcm9tICdyZWFjdC1pY29ucy9mYSc7XG5cbmludGVyZmFjZSBFdmVudENvbnRlbnRQcm9wcyB7XG4gIGVtcGxveWVlOiBhbnk7XG4gIHdvcmtpbmdTaGlmdDogYW55O1xuICBzaGlmdDogYW55O1xuICBvbkRlbGV0ZTogKHNoaWZ0SWQ6IG51bWJlcikgPT4gUHJvbWlzZTx2b2lkPjtcbiAgb25FZGl0OiAoZXZlbnQ6IGFueSkgPT4gdm9pZDtcbiAgc2hvd0FsZXJ0OiAobWVzc2FnZTogc3RyaW5nLCB0eXBlOiAnc3VjY2VzcycgfCAnZXJyb3InIHwgJ2luZm8nKSA9PiB2b2lkO1xuICByZWZyZXNoU2hpZnRzOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBhdmFpbGFibGVTaGlmdHM6IGFueVtdO1xufVxuXG5jb25zdCBFdmVudENvbnRlbnQ6IFJlYWN0LkZDPEV2ZW50Q29udGVudFByb3BzPiA9ICh7IFxuICBlbXBsb3llZSwgXG4gIHdvcmtpbmdTaGlmdCwgXG4gIHNoaWZ0LFxuICBvbkRlbGV0ZSxcbiAgb25FZGl0LFxuICBzaG93QWxlcnQsXG4gIHJlZnJlc2hTaGlmdHMsXG4gIGF2YWlsYWJsZVNoaWZ0c1xufSkgPT4ge1xuICBjb25zdCBbaXNFZGl0aW5nLCBzZXRJc0VkaXRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc2VsZWN0ZWRTaGlmdElkLCBzZXRTZWxlY3RlZFNoaWZ0SWRdID0gdXNlU3RhdGUoc2hpZnQuc2hpZnRJZCk7XG5cbiAgY29uc3QgaGFuZGxlRGVsZXRlID0gYXN5bmMgKGU6IFJlYWN0Lk1vdXNlRXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyBQcmV2ZW50IGV2ZW50IGNsaWNrIGZyb20gdHJpZ2dlcmluZ1xuICAgIFxuICAgIGlmIChjb25maXJtKGBNw7ZjaHRlbiBTaWUgZGllIFNjaGljaHQgdm9uICR7ZW1wbG95ZWU/Lm5hbWUgfHwgJ1VuYmVrYW5udCd9IHdpcmtsaWNoIGzDtnNjaGVuP2ApKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBvbkRlbGV0ZShzaGlmdC5pZCk7XG4gICAgICAgIHNob3dBbGVydChgU2NoaWNodCB2b24gJHtlbXBsb3llZT8ubmFtZSB8fCAnVW5iZWthbm50J30gd3VyZGUgZ2Vsw7ZzY2h0YCwgJ2luZm8nKTtcbiAgICAgICAgYXdhaXQgcmVmcmVzaFNoaWZ0cygpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgc2hpZnQ6JywgZXJyb3IpO1xuICAgICAgICBzaG93QWxlcnQoJ0ZlaGxlciBiZWltIEzDtnNjaGVuIGRlciBTY2hpY2h0JywgJ2Vycm9yJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUVkaXRDbGljayA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzZXRJc0VkaXRpbmcodHJ1ZSk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlQ2FuY2VsRWRpdCA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBzZXRJc0VkaXRpbmcoZmFsc2UpO1xuICAgIHNldFNlbGVjdGVkU2hpZnRJZChzaGlmdC5zaGlmdElkKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVTYXZlRWRpdCA9IGFzeW5jIChlOiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBcbiAgICAvLyBQYXJzZSB0aGUgZGF0ZSBhbmQgdGltZXNcbiAgICBjb25zdCBbeWVhciwgbW9udGgsIGRheV0gPSBzaGlmdC5kYXRlLnNwbGl0KCctJykubWFwKE51bWJlcik7XG4gICAgY29uc3Qgc2hpZnREYXRlID0gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXkpO1xuICAgIFxuICAgIGNvbnN0IG5ld1dvcmtpbmdTaGlmdCA9IGF2YWlsYWJsZVNoaWZ0cy5maW5kKHdzID0+IHdzLmlkID09PSBzZWxlY3RlZFNoaWZ0SWQpO1xuICAgIGlmICghbmV3V29ya2luZ1NoaWZ0KSB7XG4gICAgICBzaG93QWxlcnQoJ0ZlaGxlcjogU2NoaWNodCBuaWNodCBnZWZ1bmRlbicsICdlcnJvcicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFtzdGFydEhvdXIsIHN0YXJ0TWludXRlXSA9IG5ld1dvcmtpbmdTaGlmdC5mcm9tVGltZS5zcGxpdCgnOicpLm1hcChOdW1iZXIpO1xuICAgIGNvbnN0IFtlbmRIb3VyLCBlbmRNaW51dGVdID0gbmV3V29ya2luZ1NoaWZ0LnRvVGltZS5zcGxpdCgnOicpLm1hcChOdW1iZXIpO1xuICAgIFxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoc2hpZnREYXRlKTtcbiAgICBzdGFydC5zZXRIb3VycyhzdGFydEhvdXIsIHN0YXJ0TWludXRlLCAwKTtcbiAgICBcbiAgICBjb25zdCBlbmQgPSBuZXcgRGF0ZShzaGlmdERhdGUpO1xuICAgIGVuZC5zZXRIb3VycyhlbmRIb3VyLCBlbmRNaW51dGUsIDApO1xuICAgIFxuICAgIC8vIEZvciBuaWdodCBzaGlmdHMgd2hlcmUgZW5kIHRpbWUgaXMgYmVmb3JlIHN0YXJ0IHRpbWUsIGFkZCBhIGRheSB0byBlbmQgdGltZVxuICAgIGlmIChlbmQgPCBzdGFydCkge1xuICAgICAgZW5kLnNldERhdGUoZW5kLmdldERhdGUoKSArIDEpO1xuICAgIH1cblxuICAgIC8vIEZpcnN0IHNldCBlZGl0aW5nIHRvIGZhbHNlIHRvIGhpZGUgdGhlIGRyb3Bkb3duXG4gICAgc2V0SXNFZGl0aW5nKGZhbHNlKTtcblxuICAgIC8vIFRoZW4gdXBkYXRlIHRoZSBzaGlmdFxuICAgIG9uRWRpdCh7XG4gICAgICBpZDogc2hpZnQuaWQsXG4gICAgICBzdGFydCxcbiAgICAgIGVuZCxcbiAgICAgIGVtcGxveWVlSWQ6IHNoaWZ0LmVtcGxveWVlSWQsXG4gICAgICBzaGlmdElkOiBzZWxlY3RlZFNoaWZ0SWQsXG4gICAgICBleHRlbmRlZFByb3BzOiB7XG4gICAgICAgIHNoaWZ0OiB7XG4gICAgICAgICAgLi4uc2hpZnQsXG4gICAgICAgICAgc2hpZnRJZDogc2VsZWN0ZWRTaGlmdElkLFxuICAgICAgICAgIHN0YXJ0VGltZTogbmV3V29ya2luZ1NoaWZ0LmZyb21UaW1lLFxuICAgICAgICAgIGVuZFRpbWU6IG5ld1dvcmtpbmdTaGlmdC50b1RpbWVcbiAgICAgICAgfSxcbiAgICAgICAgZW1wbG95ZWUsXG4gICAgICAgIHdvcmtpbmdTaGlmdDogbmV3V29ya2luZ1NoaWZ0XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGdyb3VwXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHNcIj5cbiAgICAgICAgPHN0cm9uZz57ZW1wbG95ZWU/Lm5hbWUgfHwgJ1Vua25vd24gRW1wbG95ZWUnfTwvc3Ryb25nPlxuICAgICAgICA8YnIgLz5cbiAgICAgICAge2lzRWRpdGluZyA/IChcbiAgICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgICB2YWx1ZT17c2VsZWN0ZWRTaGlmdElkfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTZWxlY3RlZFNoaWZ0SWQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHAtMC41IHRleHQteHMgYm9yZGVyIHJvdW5kZWRcIlxuICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2F2YWlsYWJsZVNoaWZ0cy5tYXAoKHdzKSA9PiAoXG4gICAgICAgICAgICAgIDxvcHRpb24ga2V5PXt3cy5pZH0gdmFsdWU9e3dzLmlkfT5cbiAgICAgICAgICAgICAgICB7d3MudGl0bGV9XG4gICAgICAgICAgICAgIDwvb3B0aW9uPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPHNwYW4+e3dvcmtpbmdTaGlmdD8udGl0bGUgfHwgJ1Vua25vd24gU2hpZnQnfTwvc3Bhbj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMCByaWdodC0wIGZsZXggZ2FwLTEgb3BhY2l0eS0wIGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIHRyYW5zaXRpb24tb3BhY2l0eSBkdXJhdGlvbi0yMDBcIj5cbiAgICAgICAge2lzRWRpdGluZyA/IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVTYXZlRWRpdH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0xIHRleHQtZ3JlZW4tNTAwIGhvdmVyOnRleHQtZ3JlZW4tNzAwXCJcbiAgICAgICAgICAgICAgdGl0bGU9XCLDhG5kZXJ1bmdlbiBzcGVpY2hlcm5cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RmFDaGVjayBzaXplPXsxMn0gLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDYW5jZWxFZGl0fVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEgdGV4dC1ncmF5LTUwMCBob3Zlcjp0ZXh0LWdyYXktNzAwXCJcbiAgICAgICAgICAgICAgdGl0bGU9XCJBYmJyZWNoZW5cIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8RmFUaW1lcyBzaXplPXsxMn0gLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUVkaXRDbGlja31cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0xIHRleHQtYmx1ZS01MDAgaG92ZXI6dGV4dC1ibHVlLTcwMFwiXG4gICAgICAgICAgICAgIHRpdGxlPVwiU2NoaWNodCBiZWFyYmVpdGVuXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEZhRWRpdCBzaXplPXsxMn0gLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVEZWxldGV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMSB0ZXh0LXJlZC01MDAgaG92ZXI6dGV4dC1yZWQtNzAwXCJcbiAgICAgICAgICAgICAgdGl0bGU9XCJTY2hpY2h0IGzDtnNjaGVuXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPEZhVHJhc2ggc2l6ZT17MTJ9IC8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRDb250ZW50O1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJGYVRyYXNoIiwiRmFFZGl0IiwiRmFDaGVjayIsIkZhVGltZXMiLCJFdmVudENvbnRlbnQiLCJlbXBsb3llZSIsIndvcmtpbmdTaGlmdCIsInNoaWZ0Iiwib25EZWxldGUiLCJvbkVkaXQiLCJzaG93QWxlcnQiLCJyZWZyZXNoU2hpZnRzIiwiYXZhaWxhYmxlU2hpZnRzIiwiaXNFZGl0aW5nIiwic2V0SXNFZGl0aW5nIiwic2VsZWN0ZWRTaGlmdElkIiwic2V0U2VsZWN0ZWRTaGlmdElkIiwic2hpZnRJZCIsImhhbmRsZURlbGV0ZSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJjb25maXJtIiwibmFtZSIsImlkIiwiZXJyb3IiLCJjb25zb2xlIiwiaGFuZGxlRWRpdENsaWNrIiwiaGFuZGxlQ2FuY2VsRWRpdCIsImhhbmRsZVNhdmVFZGl0IiwieWVhciIsIm1vbnRoIiwiZGF5IiwiZGF0ZSIsInNwbGl0IiwibWFwIiwiTnVtYmVyIiwic2hpZnREYXRlIiwiRGF0ZSIsIm5ld1dvcmtpbmdTaGlmdCIsImZpbmQiLCJ3cyIsInN0YXJ0SG91ciIsInN0YXJ0TWludXRlIiwiZnJvbVRpbWUiLCJlbmRIb3VyIiwiZW5kTWludXRlIiwidG9UaW1lIiwic3RhcnQiLCJzZXRIb3VycyIsImVuZCIsInNldERhdGUiLCJnZXREYXRlIiwiZW1wbG95ZWVJZCIsImV4dGVuZGVkUHJvcHMiLCJzdGFydFRpbWUiLCJlbmRUaW1lIiwiZGl2IiwiY2xhc3NOYW1lIiwic3Ryb25nIiwiYnIiLCJzZWxlY3QiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwidGFyZ2V0Iiwib25DbGljayIsIm9wdGlvbiIsInRpdGxlIiwic3BhbiIsImJ1dHRvbiIsInNpemUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/workplan/EventContent.tsx\n"));

/***/ })

});