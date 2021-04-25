<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'RenderVNode',
    props: {
        vnode: {
            required: true,
            type: [Object, String]
        }
    },
    render: function() {
        return this.vnode;
    },
})
</script>