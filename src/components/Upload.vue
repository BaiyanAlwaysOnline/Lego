<template>
    <div class="file-upload">
        <div class="upload-area" v-on="uploadEvent">
            <!-- 点击上传 -->
            <div v-if="!drag">
                <slot name="loading" v-if="isUploading">
                    <a-button type='primary' :loading="isUploading">正在上传</a-button>
                </slot>
                <slot v-else-if="lastUploadedData && lastUploadedData.loaded" name="loaded">
                    <a-button type='primary'>
                        <template #icon>
                            <UploadOutlined />
                        </template>
                        上传
                    </a-button>
                </slot>
                <slot v-else name="default">
                    <a-button type='primary'>
                        <template #icon>
                            <UploadOutlined />
                        </template>
                        上传
                    </a-button>
                </slot>
            </div>
             <!-- 拖拽上传 -->
            <div v-else :class="['upload-area-drag', { 'is-dragging': isDragging }]">
                <slot name="loading" v-if="isUploading">
                    <div>正在上传</div>
                </slot>
                <slot v-else-if="lastUploadedData && lastUploadedData.loaded" name="loaded">
                    <div><UploadOutlined /> 上传</div>
                </slot>
                <slot v-else name="default">
                    <div><UploadOutlined /> 上传</div>
                </slot>
            </div>
        </div>
        <input 
            ref='fileRef' 
            type="file" 
            style="display: none"
            @change='handleFileChange'
        >
         <ul class="uploaded-file-list" v-if="listType !== ''">
            <li
                v-for="item in uploadFileList"
                :key="item.id"
            >   
                <img :src="item.url" alt="">
                <span :class="`uploaded-file ${item.status}`">{{item.name}}</span>
                <span v-if="item.status === 'uploading'">-{{item.uploadProgress}}</span>
                <DeleteOutlined  @click='deleteUploaded(item.id)' />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, PropType } from 'vue';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

type uploadStatus = 'ready' | 'uploading' |'success' | 'error';
type beforeUploadType = (file: File) => Promise<File> | boolean;
type change = (data: uploadData) => void;
type listType = 'picture' | 'text' | '';
export interface uploadData {
    id: string,
    name: string,
    size: number,
    status: uploadStatus,
    raw: File,
    uploadProgress: number,
    resp?: any,
    url?: string,
}

export default defineComponent({
    name: 'LUpload',
    props: {
        action: {
            type: String,
            required: true,
        },
        beforeUpload: {
            type: Function as PropType<beforeUploadType>,
            default: () => true,
        },
        change: {
            type: Function as PropType<change>,
        },
        drag: {
            type: Boolean,
            default: false,
        },
        autoUpload: {
            type: Boolean,
            default: true,
        },
        listType: {
            type: String as PropType<listType>,
            default: '',
        }
    },
    components: {
        DeleteOutlined,
        UploadOutlined,
    },
    setup(props) {
        const fileRef = ref<null | HTMLInputElement>(null);
        const uploadFileList = ref<uploadData[]>([]);
        const isDragging = ref(false)
        const isUploading = computed(() => uploadFileList.value.some(item => item.status === 'uploading'));
        const deleteUploaded = (id: string) => uploadFileList.value = uploadFileList.value.filter(item => item.id !== id);


        const lastUploadedData = computed(() => {
            const lastData = (uploadFileList.value)[uploadFileList.value.length - 1];
            if (lastData) {
                return {
                    resp: lastData.resp,
                    loaded: true,
                }
            }
            return false;
        })

        const handleAddFileToFileList = (file: File) => {
            const uploadObj = reactive<uploadData>({
                id: uuid(),
                name: file.name,
                size: file.size,
                status: 'ready',
                uploadProgress: 0,
                raw: file,
            })
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.addEventListener('load', () => {
                uploadObj.url = fileReader.result as string;
            })
            uploadFileList.value.push(uploadObj);
            if (props.autoUpload ) handlePostFile(uploadObj)
        }

        const handlePostFile = (uploadObj: uploadData) => {
            const { change } = props;
            const formData = new FormData();
            formData.append(uploadObj.name, uploadObj.raw);
            uploadObj.status = 'uploading';
            change && change(uploadObj)
            axios.post(props.action, formData, {
                headers: {
                    'Content-type': 'mutipart/form-data'
                },
                onUploadProgress: function (progressEvent) {
                    uploadObj.uploadProgress = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    change && change(uploadObj)
                },
            }).then(resp => {
                uploadObj.status = 'success';
                uploadObj.resp = resp.data;
            }).catch(() => {
                uploadObj.status = 'error';
            }).finally(() => {
                if (fileRef.value) fileRef.value.value = '';
                change && change(uploadObj)
            })
        }

        const handleFileChange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const files = target.files;
            if (files) beforeUploadCheck(files[0])
        }

        const beforeUploadCheck = (file: File | null) => {
            if (file) {
                const result = props.beforeUpload(file);
                if (result instanceof Promise) {
                    result
                      .then((file) => handleAddFileToFileList(file))
                      .catch(e => console.error(e))
                }
                if (result === true) {
                    handleAddFileToFileList(file);
                }
            }
        }

        const handleToggleDragStatus = (e: DragEvent, val: boolean) => {
            e.preventDefault();
            isDragging.value = val;
        }

        const triggerUpload = () => {
            if (fileRef.value) {
                fileRef.value.click();
            }
        };
        

        let uploadEvent: {[k: string]: (e: DragEvent) => void} = {
                click: triggerUpload
        }

        if (props.drag) {
            uploadEvent = {
                ...uploadEvent,
                dragleave: (e: DragEvent) => handleToggleDragStatus(e, false),
                dragover: (e: DragEvent)  => handleToggleDragStatus(e, true),
                drop: (e: DragEvent) => {
                    handleToggleDragStatus(e, false);
                    const file = e.dataTransfer?.files[0];
                    file && beforeUploadCheck(file);
                },
            }
        }

        // 实例方法 1.手动上传文件
        const submit = () => {
            uploadFileList.value.filter(readyFile => readyFile.status === 'ready').forEach(readyFile => handlePostFile(readyFile));
        }

        return {
            fileRef,
            triggerUpload,
            handleFileChange,
            uploadFileList,
            isUploading,
            deleteUploaded,
            lastUploadedData,
            uploadEvent,
            isDragging,
            submit,
        }
    }
})
</script>
<style lang="less" scoped>
.upload-area {
    display: inline-block;
    .upload-area-drag {
        width: 400px;
        height: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #ccc;
        overflow: hidden;
        color: #666;
        border-radius: 4px;
        &.is-dragging {
            border: 1px dashed #1f9de6;
            color: #1f9de6;
        }
        &:hover {
            border: 1px solid #1f9de6;
            color: #1f9de6;
            cursor: pointer;
        }
        .upload-area-show {
            width: 100%;
            height: 100%;
            display: block;
        }
    }
}
.uploaded-file-list {
    .uploaded-file {
        &.uploading {
            color: gold;
        }
        &.success {
            color: green;
        }
        &.error {
            color: red;
        }
    }
}
</style>