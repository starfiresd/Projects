USE [Hasty]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Update]    Script Date: 03/07/23 13:12:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: <Doupis>
-- Create date: <01-25-2023T17:00:00>
-- Description: Messages Update
-- Code Reviewer: Mariana Hernandez

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC[dbo].[Messages_Update]
		 @Id int
		,@Message nvarchar(1000)
		,@Subject nvarchar(100)
		,@RecipientId int
		,@SenderId int
		,@DateSent datetime2(7)
		,@DateRead datetime2(7)
		

/*---Test Code---

	DECLARE	@Id int = 8
		,@Message nvarchar(1000) = 'Test message from SQL proc REV during review'
		,@Subject nvarchar(100) = 'Test message REV'
		,@RecipientId int = 6
		,@SenderId int = 15
		,@DateSent datetime2(7) = '2023-04-10T10:00:00'
		,@DateRead datetime2(7) = '2023-04-10T10:00:01'
		
	SELECT*
	FROM [dbo].[Messages]
	WHERE Id = @Id

	EXECUTE [dbo].[Messages_Update]
		 @Id
		,@Message
		,@Subject
		,@RecipientId
		,@SenderId
		,@DateSent
		,@DateRead
		
	
	SELECT*
	FROM [dbo].[Messages]
	WHERE Id = @Id

*/

AS

BEGIN

	UPDATE [dbo].[Messages]

	SET	[Message] = @Message
		,[Subject] = @Subject
		,[RecipientId] = @RecipientId
		,[SenderId] = @SenderId
		,[DateSent] = @DateSent
		,[DateRead] = @DateRead
		,[DateModified] = GETUTCDATE()

	WHERE Id = @Id

END
GO
