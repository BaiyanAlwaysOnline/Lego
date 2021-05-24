import { message } from 'ant-design-vue';

interface checkCondition {
    size?: number;
    format?: string[];
}
interface checkResult {
    passed: boolean;
    error: ErrorType;
}

type ErrorType = 'size' | 'format' | null;

export function beforeUploadCheck(
    file: File,
    condition: checkCondition
): checkResult {
    const { size, format } = condition;
    const isValidType = format ? format.includes(file.type) : true;
    // 单位kb
    const isValidSize = size ? file.size / 1024 < size : true;
    let error: ErrorType = null;
    if (!isValidType) {
        error = 'format';
    }
    if (!isValidSize) {
        error = 'size';
    }
    return {
        passed: isValidSize && isValidType,
        error
    };
}

export function commonUploadCheck(file: File): boolean {
    const { passed, error } = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/jpg']
    });
    if (!passed) {
        if (error === 'format') {
            message.error('上传文件的格式不符！');
        }
        if (error === 'size') {
            message.error('上传文件的大小不符！');
        }
    }
    return passed;
}


