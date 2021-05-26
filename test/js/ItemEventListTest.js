const { fail, doesNotMatch } = require('assert');
var assert = require('assert');

const { expect } = require('chai');
const ItemEventList = require('../../src/htdocs/js/ItemEventList');
const StatusChangedEvent = require('../../src/htdocs/js/StatusChangedEvent');

describe('ItemEventList', function() {
  
  describe('#constructor()', function() {
    it('has to create an empty list', function() {
        const testee = new ItemEventList();
        expect(testee.getSize()).to.be.equal(0);
    });
  });


  describe ('#addEvent()', function () {
    it ( 'has to include added events into the output', function () {
        [
            new ItemEventList(),
            new ItemEventList().addEvent( new StatusChangedEvent( 'old', 'test')),
            new ItemEventList()
                .addEvent( new StatusChangedEvent( 'old', 'test'))
                .addEvent (new StatusChangedEvent ('old2', 'new'))
        ].forEach (function ( preparedList ) {
            const newEvent = new StatusChangedEvent( 'id', 'changed');
            preparedList.addEvent ( newEvent );
            expect ( preparedList.getItems()).contains ( newEvent );
        });
    });

    it ('has to decline non StatusChangedEvent parameters', function () {
        const testee = new ItemEventList();

        try {
            testee.addEvent ( 'test');
            fail ();
        } catch ( error ) {
            expect ( error).equals (ItemEventList.ERROR_NOT_AN_EVENT);
        }
    });

    it ( 'does not allow neighbors with same id and status', function () {
        [
            new ItemEventList ()
                .addEvent ( new StatusChangedEvent ('id', 'new', 1))
                .addEvent ( new StatusChangedEvent ('id', 'start', 10))
                .addEvent ( new StatusChangedEvent ('id', 'work', 90))
                .addEvent ( new StatusChangedEvent ('id', 'finished', 200)),
            new ItemEventList ()
                .addEvent ( new StatusChangedEvent ('id', 'new', 1))
                .addEvent ( new StatusChangedEvent ('id', 'start', 10))
                .addEvent ( new StatusChangedEvent ('id', 'work', 110))
                .addEvent ( new StatusChangedEvent ('id', 'finished', 200)),

        ].forEach( function ( preparedList ) {
            try {
                preparedList.addEvent ( new StatusChangedEvent ( "id", "work", 100 ));
                console.log ( preparedList );
                fail();
            } catch ( error ) {
                expect ( error ).is.equal(ItemEventList.ERROR_NEIGHBOR_CONFLICT);
            }
        });


    });
  });


  describe ('#getEvents()', function () {
      it ('has to order events by increasing by timestamp', function () {

      [
        new ItemEventList(),
        new ItemEventList()
            .addEvent ( new StatusChangedEvent('id', 'new', 100))
            .addEvent ( new StatusChangedEvent('id', 'start', 200))
            .addEvent ( new StatusChangedEvent('id', 'work', 50))
            .addEvent ( new StatusChangedEvent('id', 'finished', 7))
            .addEvent ( new StatusChangedEvent('id', 'more work', 110))
            .addEvent ( new StatusChangedEvent('id', 'started work', 90))
      ].forEach ( function ( preparedList ) {
        let lastItem = null;
        preparedList.getItems().forEach ( item => {
            if ( lastItem ) {
                expect ( item.getTimestamp() ).is.greaterThanOrEqual ( lastItem.getTimestamp());
            }
            lastItem = item;
        })
      });
    });
  });

});