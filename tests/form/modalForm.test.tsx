﻿import React from 'react';
import { ProFormText, ModalForm } from '@ant-design/pro-form';
import { Button } from 'antd';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { waitForComponentToPaint } from '../util';

describe('ModalForm', () => {
  it('📦 trigger will simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(true);
  });

  it('📦 submitter config no reset default config', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '取消',
          },
          resetButtonProps: {
            style: {
              width: '80px',
            },
            id: 'reset',
          },
        }}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper, 200);
    expect(fn).toBeCalledWith(true);

    act(() => {
      wrapper.find('button#reset').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(false);
  });

  it('📦 ModalForm first no render items', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeFalsy();

    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('input#test').exists()).toBeTruthy();
  });

  it('📦 ModalForm first render items', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        modalProps={{
          forceRender: true,
        }}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeTruthy();
  });

  it('📦 ModalForm destroyOnClose', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        width={600}
        modalProps={{ destroyOnClose: true }}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeFalsy();

    act(() => {
      wrapper.setProps({
        visible: true,
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('input#test').exists()).toBeTruthy();

    act(() => {
      wrapper.setProps({
        visible: false,
      });
    });
    await waitForComponentToPaint(wrapper, 2000);

    expect(wrapper.find('input#test').exists()).toBeFalsy();
  });

  it('📦 modal close button will simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(false);
    expect(fn).toBeCalledTimes(2);
  });

  it('📦 modal visible=true simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(true);
  });

  it('📦 reset button will simulate onVisibleChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-modal-footer').update().find('button.ant-btn').at(0).simulate('click');
    });
    expect(fn).toBeCalledWith(false);
  });

  it('📦 modal close button will simulate modalProps.onCancel', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        modalProps={{
          onCancel: () => fn(false),
        }}
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith(false);
  });

  it('📦 form onFinish return true should close modal', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
        onFinish={async () => true}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper, 500);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(false);
  });

  it('📦 form onFinish is null, no close modal', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ModalForm
        visible
        trigger={<Button id="new">新建</Button>}
        onVisibleChange={(visible) => fn(visible)}
      >
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper, 500);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledTimes(1);
  });

  it('📦 ModalForm support submitter is false', async () => {
    const wrapper = mount(
      <ModalForm visible trigger={<Button id="new">新建</Button>} submitter={false}>
        <ProFormText name="name" />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-modal-footer').length).toBe(0);
  });

  it('📦 ModalForm close no rerender from', async () => {
    const wrapper = mount(
      <ModalForm
        initialValues={{
          name: '1234',
        }}
        trigger={<Button id="new">新建</Button>}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button#new').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 300);
    act(() => {
      wrapper
        .find('.ant-input#test')
        .at(0)
        .simulate('change', {
          target: {
            value: 'test',
          },
        });
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('Input#test').props().value).toEqual('test');
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('Input#test').props().value).toEqual('test');
  });

  it('📦 ModalForm destroyOnClose close will rerender from', async () => {
    const wrapper = mount(
      <ModalForm
        modalProps={{
          getContainer: false,
          destroyOnClose: true,
        }}
        initialValues={{
          name: '1234',
        }}
        trigger={<Button id="new">新建</Button>}
      >
        <ProFormText
          name="name"
          fieldProps={{
            id: 'test',
          }}
        />
      </ModalForm>,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button#new').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 300);
    act(() => {
      wrapper
        .find('.ant-input#test')
        .at(0)
        .simulate('change', {
          target: {
            value: '1111',
          },
        });
    });

    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('Input#test').props().value).toEqual('1111');

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-modal-close').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button#new').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('Input#test').props().value).toEqual('1234');
  });
});
