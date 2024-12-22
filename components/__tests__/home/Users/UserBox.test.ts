import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import UserBox from '~/components/home/Users/UserBox.vue'; // Replace with the actual path to your component

describe('UserBox', () => {
  const props = {
    profilePicture: "https://example.com/profile.jpg",
    name: "Test User",
    userTurn: true,
    friendRequest: false,
    friendshipId: 1,
    friendsStatus: "PENDING",
    friendId: "123",
    viewType: 0,
    startGame: false,
  };

  it('renders the user name correctly', async () => {
    const wrapper = await mountSuspended(UserBox, { props });
    expect(wrapper.text()).toContain(props.name);
  });

  it('displays the profile picture with the correct src', async () => {
    const wrapper = await mountSuspended(UserBox, { props });
    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe(props.profilePicture);
  });

  it('emits chose_friend when userTurn and startGame are true', async () => {
    const wrapper = await mountSuspended(UserBox, {
      props: { ...props, userTurn: true, startGame: true },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('chose_friend')).toBeTruthy();
    expect(wrapper.emitted('chose_friend')[0]).toEqual([props.friendId]);
  });

  it('shows the modal when clicked and startGame is false', async () => {
    const wrapper = await mountSuspended(UserBox, { props });
    await wrapper.trigger('click');
    expect(wrapper.findComponent({ name: 'ProfileUserModal' }).isVisible()).toBe(true);
  });
});
