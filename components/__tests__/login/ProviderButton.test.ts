import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ProviderButton from "~/components/login/ProviderButton.vue";


describe('ProviderButton', () => {
    const provider = {id: 'spotify', name: 'Spotify'};

    it('renders the message correctly', async () => {
        const wrapper = await mountSuspended(ProviderButton,{props: {provider: provider.id, name: provider.name}});
        expect(wrapper.text()).toContain('Sign in with ' + provider.name);
    });

    // Test default props
    it('uses default props when none provided', async () => {
        const wrapper = await mountSuspended(ProviderButton);
        expect(wrapper.text()).toContain('Sign in with Spotify');
        expect(wrapper.vm.provider).toBe('spotify');
    });

    // Test image rendering
    it('renders the correct provider icon', async () => {
        const wrapper = await mountSuspended(ProviderButton, {
            props: {provider: provider.id}
        });
        const img = wrapper.find('img');
        expect(img.attributes('src')).toContain('icons/spotify.svg');
        expect(img.attributes('alt')).toBe('spotify');
    });

    // Test button styling
    it('has correct styling classes', async () => {
        const wrapper = await mountSuspended(ProviderButton);
        const buttonDiv = wrapper.find('.flex');
        expect(buttonDiv.classes()).toContain('bg-[#1DB954]'); // Spotify color
    });

});