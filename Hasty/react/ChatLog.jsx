import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { Card, Tabs, Tab } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import SimpleBar from 'simplebar-react';
import '../messages.css';
import 'simplebar-react/dist/simplebar.min.css';

export default function ChatLog(props) {
    const { recentCards } = props;
    const [key, setKey] = useState('All');
    const [query] = useState({ query: '' });

    return (
        <>
            <Card className="card-body message-list-card">
                <Tabs id="message-list" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                    <Tab eventKey="All" title="All">
                        <SimpleBar>
                            <Formik enableReinitialize={true} initialValues={query}>
                                <Form>
                                    <div className="wrapper-field">
                                        <div className="icon-field">
                                            <FaSearch />
                                        </div>
                                        <Field
                                            type="text"
                                            name="query"
                                            className="form-control mb-2"
                                            placeholder="     People, groups & messages"
                                        />
                                    </div>
                                </Form>
                            </Formik>
                            {recentCards && recentCards}
                        </SimpleBar>
                    </Tab>
                    <Tab eventKey="Favorites" title="Favorites">
                        <SimpleBar>
                            <Formik enableReinitialize={true} initialValues={query}>
                                <Form>
                                    <div className="wrapper-field">
                                        <div className="icon-field">
                                            <FaSearch />
                                        </div>
                                        <Field
                                            type="text"
                                            name="query"
                                            className="form-control mb-2"
                                            placeholder="     People, groups & messages"
                                        />
                                    </div>
                                </Form>
                            </Formik>
                            {recentCards && recentCards}
                        </SimpleBar>
                    </Tab>
                    <Tab eventKey="Friends" title="Friends">
                        <SimpleBar>
                            <Formik enableReinitialize={true} initialValues={query}>
                                <Form>
                                    <div className="wrapper-field">
                                        <div className="icon-field">
                                            <FaSearch />
                                        </div>
                                        <Field
                                            type="text"
                                            name="query"
                                            className="form-control mb-2"
                                            placeholder="     People, groups & messages"
                                        />
                                    </div>
                                </Form>
                            </Formik>
                            {recentCards && recentCards}
                        </SimpleBar>
                    </Tab>
                </Tabs>
            </Card>
        </>
    );
}

ChatLog.propTypes = {
    recentCards: PropTypes.arrayOf(PropTypes.element),
};
