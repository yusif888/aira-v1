const FooterContacts = ({ quickContacts }) => (
    <div className="space-y-6">
        <h4 className="text-base font-bold text-white mb-6">Kontak</h4>
        <div className="space-y-6">
            {quickContacts.map((contact) => (
                <div key={contact.title} className="space-y-2">
                    <h5 className="text-sm font-bold text-white">
                        {contact.title}
                    </h5>
                    <p className="text-white/60 text-sm leading-relaxed">
                        {contact.content}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

export default FooterContacts;
