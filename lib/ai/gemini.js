"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedQuery = embedQuery;
exports.generateChatResponse = generateChatResponse;
exports.generateTitle = generateTitle;
var google_1 = require("@ai-sdk/google");
var ai_1 = require("ai");
var google = (0, google_1.createGoogleGenerativeAI)({
    apiKey: process.env.GOOGLE_API_KEY,
});
var RATE_LIMIT_DELAY = 2000;
var lastEmbedTime = 0;
var lastGenerateTime = 0;
function embedQuery(text) {
    return __awaiter(this, void 0, void 0, function () {
        var now, timeSinceLastEmbed, _a, embedding, usage, error_1, retryAfter;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    now = Date.now();
                    timeSinceLastEmbed = now - lastEmbedTime;
                    if (!(timeSinceLastEmbed < RATE_LIMIT_DELAY)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastEmbed); })];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, ai_1.embed)({
                            model: google.embedding('embedding-001'),
                            value: text,
                        })];
                case 3:
                    _a = _c.sent(), embedding = _a.embedding, usage = _a.usage;
                    console.log('Embedding API Usage:', usage);
                    lastEmbedTime = Date.now();
                    return [2 /*return*/, embedding];
                case 4:
                    error_1 = _c.sent();
                    if ((error_1 === null || error_1 === void 0 ? void 0 : error_1.statusCode) === 429) {
                        retryAfter = ((_b = error_1 === null || error_1 === void 0 ? void 0 : error_1.headers) === null || _b === void 0 ? void 0 : _b['retry-after']) ? parseInt(error_1.headers['retry-after']) * 1000 : 60000;
                        throw { statusCode: 429, message: error_1.message, retryAfter: retryAfter };
                    }
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function generateChatResponse(messages, systemPrompt) {
    return __awaiter(this, void 0, void 0, function () {
        var now, timeSinceLastGenerate, result, finalResult, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = Date.now();
                    timeSinceLastGenerate = now - lastGenerateTime;
                    if (!(timeSinceLastGenerate < 500)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500 - timeSinceLastGenerate); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, ai_1.streamText)({
                            model: google('gemini-1.5-flash-latest'),
                            system: systemPrompt,
                            messages: messages,
                        })];
                case 3:
                    result = _a.sent();
                    finalResult = result.toTextStreamResponse();
                    lastGenerateTime = Date.now();
                    return [2 /*return*/, finalResult];
                case 4:
                    error_2 = _a.sent();
                    if ((error_2 === null || error_2 === void 0 ? void 0 : error_2.statusCode) === 429) {
                        throw { statusCode: 429, message: error_2.message };
                    }
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function generateTitle(text) {
    return __awaiter(this, void 0, void 0, function () {
        var now, timeSinceLastGenerate, prompt, _a, title, usage, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    now = Date.now();
                    timeSinceLastGenerate = now - lastGenerateTime;
                    if (!(timeSinceLastGenerate < 500)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500 - timeSinceLastGenerate); })];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    prompt = "Based on the following user message, create a short, concise title (4 words maximum) for this conversation.\n\n  MESSAGE: \"".concat(text, "\"\n  \n  TITLE:");
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, ai_1.generateText)({
                            model: google('gemini-1.5-flash-latest'),
                            prompt: prompt,
                            maxOutputTokens: 15
                        })];
                case 4:
                    _a = _b.sent(), title = _a.text, usage = _a.usage;
                    console.log('Title Generation API Usage:', usage);
                    lastGenerateTime = Date.now();
                    return [2 /*return*/, title.trim().replace(/"/g, '')];
                case 5:
                    error_3 = _b.sent();
                    console.error('Title generation failed:', error_3);
                    return [2 /*return*/, 'New Conversation'];
                case 6: return [2 /*return*/];
            }
        });
    });
}
