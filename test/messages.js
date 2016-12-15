'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.test
const sinon = require('sinon')
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach
const expect = require('code').expect
const Promise = require('bluebird')

const Base = require('../lib/base')
const Messages = require('../lib/messages')

describe('Messages', function () {
  let message

  beforeEach((done) => {
    message = new Messages({
      messages: {
        create: sinon.stub().returns(Promise.resolve('create'))
      }
    })
    done()
  })

  it('should extend base', (done) => {
    expect(message).to.be.an.instanceOf(Base)
    done()
  })

  describe('create', () => {
    const messageData = {
      message_type: 'email',
      subject: 'Your Infrastructure Is Ready',
      body: 'Hey Billy,<br><br>' +
        'Thanks for signing up!<br> Your infrastructure is ready, the <b>BillyBobIndustries' +
        '</b> environment is good to go.<br><br>' + '<a href="https://app.runnable.io/BillyBobIndustries' +
        '">Go to Runnable.</a><br><br>' + 'Your account is free to use for 14 days. ' +
        'If you get stuck setting up, just reply to this email. <br><br>' +
        'Your best friend,<br>Praful Rana<br>Customer Success @ Runnable',
      template: 'plain',
      from: {
        type: 'admin',
        id: '22382'
      },
      to: {
        type: 'user',
        id: '1234'
      }
    }
    const returnedVal = {
      body: {
        foo: 'bar'
      }
    }

    beforeEach((done) => {
      sinon.stub(message, '_wrap').returns(Promise.resolve(returnedVal))
      done()
    })

    afterEach((done) => {
      message._wrap.restore()
      done()
    })

    it('should call _wrap with the proper parameters', (done) => {
      message.create(messageData)
        .then((results) => {
          sinon.assert.calledOnce(message._wrap)
          sinon.assert.calledWith(message._wrap, 'create', messageData)
          expect(results).to.equal(returnedVal)
        })
        .asCallback(done)
    })
  })
})
