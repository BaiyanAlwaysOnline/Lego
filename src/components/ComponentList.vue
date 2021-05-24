<template>
    <div class="component-list">
        <div
            class="component-wrapper"
            v-for="(item, index) in list"
            :key="index"
            @click="handleClickItem(item)"
        >
            <l-text v-bind="item" />
        </div>
        <l-upload
            action="http://123.57.138.48/api/upload/"
            :change="
                ({ status, resp, url, uploadProgress, raw }) =>
                    handleUpload({ status, resp, url, uploadProgress, raw })
            "
            :beforeUpload="handleCheckBeforeUpload"
        >
            <a-button>上传图片</a-button>
        </l-upload>
    </div>
</template>
<script lang='ts'>
import { PropType } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import LText from './LText.vue';
import { TextComponentProps, imageDefaultProps } from '../defaultProps';
import { commonUploadCheck } from '@/utils/checkBeforeUpload';
import LUpload from '@/components/Upload.vue';
import { ComponentData } from '@/store/editor';
import getImageOriginalSize from '@/utils/getImageOriginalSize';

export default {
    name: 'ComponentList',
    components: {
        LText,
        LUpload,
    },
    props: {
        list: {
            type: Array as PropType<TextComponentProps[]>,
            required: true,
        },
    },
    emits: ['add-component'],
    setup(props, ctx) {
        const handleClickItem = (
            componentData: Partial<TextComponentProps>
        ) => {
            ctx.emit('add-component', {
                id: uuidv4(),
                name: 'l-text',
                props: componentData,
            });
        };

        const handleUpload = async ({ status, raw: file, resp }) => {
            const maxWidth = 373;
            const componentData: ComponentData = {
                id: uuidv4(),
                name: 'l-image',
                props: {
                    ...imageDefaultProps,
                },
            };
            if (status === 'success') {
                componentData.props.src = resp.data.url;
                const { width } = await getImageOriginalSize(file);
                componentData.props.width = Math.min(maxWidth, width) + 'px';
                ctx.emit('add-component', componentData);
            }
        };
        const handleCheckBeforeUpload = (file: File) => {
            return commonUploadCheck(file);
        };
        return {
            handleClickItem,
            handleUpload,
            handleCheckBeforeUpload,
        };
    },
};
</script>
<style>
.component-list {
    display: flex;
    flex-wrap: wrap;
}
</style>
