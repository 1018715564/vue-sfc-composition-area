import { vueSfcAstParser } from "@originjs/vue-sfc-ast-parser";
import { readFile } from "fs";
import { SPECIAL_MARK } from "../index";
import type { List } from "../index";


export const checkScriptTag = (fileName: string): Promise<false | { ast: any, line?: number }> => {
    return new Promise((resolve, reject) => {
        readFile(fileName, (error, data) => {
            if (error) {
                reject(error);
            } else {
                const { scriptAST, descriptor } = vueSfcAstParser({
                    path: fileName,
                    source: data.toString()
                });
                if (scriptAST !== null) {
                    resolve({
                        ast: scriptAST,
                        line: descriptor?.script?.loc.start.line
                    });
                } else {
                    resolve(false);
                }
            }
        });
    });
};

export const parseCommentsToList = (ast: any[]): List => {
    ast = ast.filter((item: any) => item.type === 'CommentLine' && item.value.includes(SPECIAL_MARK));
    // 注释块中的代码是成双成对的，所以最后的结果是一半, 就进行截取
    if (ast.length % 2 !== 0) {
        ast.pop();
    }
    const list = [];
    // ast每2个循环一次 (一对标签视为一个block)
    for (let i = 0; i < ast.length; i += 2) {
        // 获取开始标签和结束标签的line行数
        ast[i]['loc']['end']['line'];
        list.push({
            title: ast[i].value.split('#')[1],
            start: ast[i]['loc']['end']['line'],
            end: ast[i + 1]['loc']['start']['line']
        });
    }
    console.log(list);
    return list;
};