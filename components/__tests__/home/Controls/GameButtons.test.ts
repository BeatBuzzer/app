import {mount} from "@vue/test-utils";
import { describe, it, expect } from 'vitest';
import GameButtons from "@/components/home/Controls/GameButtons.vue";


describe('GameButtons', () => {
    // Test component mounting
    it('renders properly', () => {
        const wrapper = mount(GameButtons);

        // Check if both buttons are rendered
        expect(wrapper.findAll('button')).toHaveLength(2);

        // Check button text content
        const buttons = wrapper.findAll('button');
        expect(buttons[0].text()).toBe('Start Game');
        expect(buttons[1].text()).toBe('Quick Game');
    });

    // Test Start Game button emission
    it('emits startGame event when Start Game button is clicked', async () => {
        const wrapper = mount(GameButtons);

        // Find and click the Start Game button
        const startGameButton = wrapper.findAll('button')[0];
        await startGameButton.trigger('click');

        // Check if the event was emitted
        expect(wrapper.emitted()).toHaveProperty('startGame');
        expect(wrapper.emitted('startGame')).toHaveLength(1);
    });

    // Test Quick Game button emission
    it('emits quickGame event when Quick Game button is clicked', async () => {
        const wrapper = mount(GameButtons);

        // Find and click the Quick Game button
        const quickGameButton = wrapper.findAll('button')[1];
        await quickGameButton.trigger('click');

        // Check if the event was emitted
        expect(wrapper.emitted()).toHaveProperty('quickGame');
        expect(wrapper.emitted('quickGame')).toHaveLength(1);
    });

    // Test multiple clicks
    it('emits multiple events on multiple clicks', async () => {
        const wrapper = mount(GameButtons);
        const [startButton, quickButton] = wrapper.findAll('button');

        // Click start game button twice
        await startButton.trigger('click');
        await startButton.trigger('click');

        // Click quick game button twice
        await quickButton.trigger('click');
        await quickButton.trigger('click');

        // Check if events were emitted correct number of times
        expect(wrapper.emitted('startGame')).toHaveLength(2);
        expect(wrapper.emitted('quickGame')).toHaveLength(2);
    });
});