import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ProviderButton from "~/components/login/ProviderButton.vue";


describe('ProviderButton', () => {
    const provider = {id: 'spotify', name: 'Spotify'};

    it('renders the message correctly', async () => {
        const wrapper = await mountSuspended(ProviderButton,{props: {provider: provider.id, name: provider.name}});
        expect(wrapper.text()).toContain('Sign in with ' + provider.name);
    });
});